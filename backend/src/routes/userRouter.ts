import express, { Request, Response, Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import prisma from "../lib/prisma";

dotenv.config();
const router: Router = express.Router();

const ACCESS_SECRET = process.env.ACCESS_SECRET!;
const REFRESH_SECRET = process.env.REFRESH_SECRET!;
if (!ACCESS_SECRET || !REFRESH_SECRET) {
  throw new Error(
    "ACCESS_SECRET or REFRESH_SECRET environment variable is not set"
  );
}

const MAX_PIN_LENGTH = 6;

router.post(
  "/create-admin",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const existingUser = await prisma.user.findFirst();

      if (existingUser) {
        res
          .status(400)
          .json({ message: "Admin account already exists", success: false });
        return;
      }

      const { email, pin } = req.body;

      if (!email || !pin || email === "" || pin === "") {
        res
          .status(401)
          .json({ message: "Fill in the requirements.", success: false });
        return;
      }

      const verifiedOtp = await prisma.otp.findFirst({
        where: {
          email: email,
          verified: true,
        },
      });

      if (!verifiedOtp) {
        res.status(400).json({
          message: "Email not verified or OTP not completed",
          success: false,
        });
        return;
      }

      const hashedPin = await bcrypt.hash(pin, 10);
      await prisma.user.create({
        data: {
          email: email,
          pin: hashedPin,
        },
      });
      res.status(200).json({
        message: "Admin account created successfully",
        success: true,
      });
      return;
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        success: false,
      });
      return;
    }
  }
);

router.post("/login", async (req: Request, res: Response): Promise<void> => {
  try {
    const { pin } = req.body;

    if (pin === undefined || pin === null || pin === "") {
      res.status(400).json({ message: "PIN cannot be empty" });
      return;
    }

    if (typeof pin !== "string") {
      res.status(400).json({ message: "PIN must be a string" });
      return;
    }

    if (pin.length !== MAX_PIN_LENGTH) {
      res.status(400).json({ message: "PIN must be 6 digits" });
      return;
    }

    if (!/^\d+$/.test(pin)) {
      res.status(400).json({ message: "PIN must contain only numbers" });
      return;
    }

    const user = await prisma.user.findFirst();
    if (!user) {
      res.status(404).json({ message: "No user account found" });
      return;
    }

    const isMatch = await bcrypt.compare(pin, user.pin);
    if (!isMatch) {
      res.status(401).json({ message: "Invalid PIN" });
      return;
    }

    const accessToken = jwt.sign({ userId: user.id }, ACCESS_SECRET, {
      expiresIn: "15m",
    });
    const refreshToken = jwt.sign({ userId: user.id }, REFRESH_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken });
    return;
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      success: false,
      error:
        process.env.NODE_ENV === "development" ||
        process.env.NODE_ENV === "test"
          ? { message: (error as Error).message }
          : undefined,
    });
    return;
  }
});

router.get(
  "/check-user",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const hasRefreshToken = Boolean(req.cookies["refresh_token"]);
      const user = await prisma.user.findFirst();

      if (!user) {
        res.status(200).json({ message: "No admin found", isPinSet: false });
        return;
      }

      res.json({ isPinSet: true, isAuthenticated: hasRefreshToken });
      return;
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
      return;
    }
  }
);

router.post("/logout", async (req: Request, res: Response): Promise<void> => {
  try {
    res.clearCookie("refresh_token");
    res.json({ message: "Logged out successfully" });
    return;
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error:
        process.env.NODE_ENV === "development" ||
        process.env.NODE_ENV === "test"
          ? { message: (error as Error).message }
          : undefined,
    });
    return;
  }
});

export default router;

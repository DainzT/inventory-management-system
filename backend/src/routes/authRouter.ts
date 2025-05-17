import express, { Request, Response, Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import prisma from "../lib/prisma";
import { generateOtp, saveOtpToDatabase } from "../lib/otpService";
import nodemailer from "nodemailer";
import { authenticateToken } from "../middleware/authMiddleware";

dotenv.config();
const router: Router = express.Router();

const transporter = nodemailer.createTransport({
  pool: true,
  maxConnections: 5,
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

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
      error: process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test'
        ? { message: (error as Error).message }
        : undefined,
    });
    return;
  }
});

router.put(
  "/change-pin",
  authenticateToken,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { newPin } = req.body;

      if (!newPin || newPin === "") {
        res.status(400).json({ message: "PIN is required.", success: false });
        return;
      }

      if (newPin.length !== MAX_PIN_LENGTH) {
        res.status(400).json({
          message: `New PIN must be exactly ${MAX_PIN_LENGTH} characters long`,
          success: false,
        });
        return;
      }

      const user = await prisma.user.findFirst();
      if (!user) {
        res
          .status(404)
          .json({ message: "No user account found", success: false });
        return;
      }

      const isSamePin = await bcrypt.compare(newPin, user.pin);
      if (isSamePin) {
        res.status(400).json({
          message: "New PIN must be different from current PIN",
          success: false,
        });
        return;
      }

      const hashedNewPin = await bcrypt.hash(newPin, 10);
      await prisma.user.update({
        where: { id: user.id },
        data: { pin: hashedNewPin },
      });

      res.json({ message: "PIN updated successfully", success: true });
      return;
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        success: false,
        error: process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test'
          ? { message: (error as Error).message }
          : undefined,
      });
      return;
    }
  }
);

router.put(
  "/change-email",
  authenticateToken,
  async (req: Request, res: Response): Promise<void> => {
    const { oldEmail, newEmail } = req.body;

    if (
      !oldEmail ||
      !newEmail ||
      typeof oldEmail !== "string" ||
      typeof newEmail !== "string"
    ) {
      res.status(400).json({
        message: "Both old and new email are required.",
        success: false,
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(oldEmail)) {
      res
        .status(400)
        .json({ message: "Old email format is invalid.", success: false });
      return;
    }

    if (!emailRegex.test(newEmail)) {
      res
        .status(400)
        .json({ message: "New email format is invalid.", success: false });
      return;
    }

    if (oldEmail === newEmail) {
      res.status(400).json({
        message: "New email must be different from old email.",
        success: false,
      });
      return;
    }

    try {
      const emailExists = await prisma.user.findFirst({
        where: { email: newEmail },
      });

      if (emailExists) {
        res
          .status(409)
          .json({ message: "New email is already in use.", success: false });
        return;
      }

      const user = await prisma.user.findFirst({
        where: { email: oldEmail },
      });

      if (!user) {
        res
          .status(404)
          .json({ message: "Old email not found.", success: false });
        return;
      }

      await prisma.user.update({
        where: { id: user.id },
        data: { email: newEmail },
      });

      res.json({ message: "Email updated successfully.", success: true });
      return;
    } catch (error) {
      res
        .status(500)
        .json({ message: "Internal server error", success: false });
      return;
    }
  }
);

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

router.post(
  "/refresh-token",
  async (req: Request, res: Response): Promise<void> => {
    const refreshToken = req.cookies["refresh_token"];
    if (!refreshToken) {
      res.sendStatus(401);
      return;
    }

    try {
      const payload = jwt.verify(refreshToken, REFRESH_SECRET) as {
        userId: number;
      };

      const accessToken = jwt.sign({ userId: payload.userId }, ACCESS_SECRET, {
        expiresIn: "15m",
      });

      res.json({ accessToken });
      return;
    } catch (err) {
      res.sendStatus(403);
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
      error: process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test'
        ? { message: (error as Error).message }
        : undefined,
    });
    return;
  }
});

router.post(
  "/send-otp-email",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, pin, confirmPin } = req.body;

      if (!email || !pin || !confirmPin) {
        res.status(400).json({
          message: "Fill in the requirements.",
        });
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        res
          .status(400)
          .json({ message: "Please enter a valid email address." });
        return;
      }

      if (pin.length !== 6 || !/^\d+$/.test(pin)) {
        res.status(400).json({
          message: "PIN must be exactly 6 digits.",
          success: false,
        });
        return;
      }

      if (pin !== confirmPin) {
        res.status(400).json({
          message: "PIN and confirmation PIN do not match.",
          success: false,
        });
        return;
      }

      const existingOtp = await prisma.otp.findFirst({
        where: {
          email: email,
          verified: false,
          otpExpiration: {
            gt: new Date(),
          },
        },
      });

      if (existingOtp) {
        const retryAfter = Math.ceil(
          (existingOtp.otpExpiration.getTime() - Date.now()) / 1000
        );

        res.status(429).json({
          message: `An active OTP already exists. Please check your email and retry after ${retryAfter}.`,
          success: false,
          retryAfter: retryAfter,
        });
        return;
      }

      const otp = generateOtp();
      const otpExpiry = Date.now() + 10 * 60 * 1000;

      await saveOtpToDatabase(otp, email, new Date(otpExpiry));

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your OTP Code",
        text: `Your OTP code is: ${otp}`,
      });

      res.status(200).json({ message: "OTP sent successfully", success: true });
      return;
    } catch (error) {
      res.status(500).json({
        message: "Failed to send OTP",
        success: false,
        error: process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test'
          ? { message: (error as Error).message }
          : undefined,
      });
      return;
    }
  }
);

router.post(
  "/verify-pin",
  async (req: Request, res: Response): Promise<void> => {
    const { pin } = req.body;
    try {
      const user = await prisma.user.findFirst();

      if (!user) {
        res.status(404).json({ message: "User not found", success: false });
        return;
      }

      const isMatch = await bcrypt.compare(pin, user.pin);
      if (!isMatch) {
        res.status(401).json({ message: "Invalid PIN", success: false });
        return;
      }

      res
        .status(200)
        .json({ message: "PIN verified successfully", success: true });
      return;
    } catch (error) {
      res.status(500).json({
        message: "Failed to verify PIN",
        success: false,
        error: process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test'
          ? { message: (error as Error).message }
          : undefined,
      });
      return;
    }
  }
);

router.post(
  "/verify-email",
  async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;

    try {
      const user = await prisma.user.findFirst();

      if (!user || user.email !== email) {
        res.status(400).json({ message: "Invalid email address" });
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        res
          .status(400)
          .json({ message: "Please enter a valid email address." });
        return;
      }

      const existingOtp = await prisma.otp.findFirst({
        where: {
          email: email,
          verified: false,
          otpExpiration: {
            gt: new Date(),
          },
        },
      });

      if (existingOtp) {
        const retryAfter = Math.ceil(
          (existingOtp.otpExpiration.getTime() - Date.now()) / 1000
        );

        res.status(429).json({
          message: `An active OTP already exists. Please check your email and retry after ${retryAfter}.`,
          success: false,
          retryAfter: retryAfter,
        });
        return;
      }

      const otp = generateOtp();
      const otpExpiry = Date.now() + 10 * 60 * 1000;

      await saveOtpToDatabase(otp, email, new Date(otpExpiry));

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your OTP Code",
        text: `Your OTP code is: ${otp}`,
      });

      res.status(200).json({ message: "OTP sent successfully", success: true });
      return;
    } catch (error) {
      res.status(500).json({
        message: "Failed to verify email",
        success: false,
        error: process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test'
          ? { message: (error as Error).message }
          : undefined,
      });
      return;
    }
  }
);

router.post(
  "/verify-otp",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { otp } = req.body;

      if (!otp || otp === "") {
        res.status(400).json({ message: "OTP is required." });
        return;
      }

      const otpRecord = await prisma.otp.findFirst({
        where: {
          otp,
          verified: false,
        },
      });

      if (!otpRecord) {
        res.status(400).json({ message: "Invalid OTP" });
        return;
      }

      const currentTime = new Date();
      if (currentTime > otpRecord.otpExpiration) {
        res.status(400).json({ message: "OTP has expired" });
        return;
      }

      await prisma.otp.update({
        where: {
          id: otpRecord.id,
        },
        data: {
          verified: true,
        },
      });

      res.status(200).json({
        message: "OTP verified successfully",
        success: true,
      });
      return;
    } catch (error) {
      res.status(500).json({
        message: "Failed to verify OTP",
        success: false,
        error: process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test'
          ? { message: (error as Error).message }
          : undefined,
      });
      return;
    }
  }
);

router.post(
  "/reset-pin",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, newPin } = req.body;

      if (!newPin || newPin === "") {
        res.status(400).json({
          message: "PIN is required.",
          success: false,
        });
        return;
      }

      if (newPin.length !== MAX_PIN_LENGTH || !/^\d+$/.test(newPin)) {
        res.status(400).json({
          message:
            "New PIN must be exactly 6 digits long and only contain numbers.",
          success: false,
        });
        return;
      }

      const user = await prisma.user.findFirst({ where: { email } });
      if (!user) {
        res.status(404).json({ message: "User not found", success: false });
        return;
      }

      const isSamePin = await bcrypt.compare(newPin, user.pin);
      if (isSamePin) {
        res.status(400).json({
          message: "New PIN must be different from current PIN",
          success: false,
        });
        return;
      }

      const hashedNewPin = await bcrypt.hash(newPin, 10);

      await prisma.user.update({
        where: { id: user.id },
        data: { pin: hashedNewPin },
      });
      res.json({ message: "PIN reset successfully", success: true });
      return;
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        success: false,
        error: process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test'
          ? { message: (error as Error).message }
          : undefined,
      });
      return;
    }
  }
);

export default router;

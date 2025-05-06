import express, { Request, Response, Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import prisma from "../lib/prisma";
import { generateOtp, saveOtpToDatabase } from "../lib/otpService";
import nodemailer from "nodemailer";
// import supabase from "../lib/supabaseClient";
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

const isPinSet = async (): Promise<boolean> => {
  try {
    const userCount = await prisma.user.count();
    return userCount > 0;
  } catch (error) {
    throw error;
  }
};

router.post(
  "/create-admin",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const existingUser = await prisma.user.findFirst();
      if (existingUser) {
        res.status(400).json({ message: "Admin account already exists" });
        return;
      }

      const { pin } = req.body;
      if (!pin || pin.length !== 6 || !/^\d+$/.test(pin)) {
        res.status(400).json({
          message: "PIN is required and must be exactly 6 digits long.",
        });
        return;
      }

      const hashedPin = await bcrypt.hash(pin, 10);
      await prisma.user.create({
        data: {
          email: req.body.email,
          pin: hashedPin,
        },
      });
      res.json({ message: "Admin account created successfully" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

router.post(
  "/setup-pin",
  async (req: Request, res: Response): Promise<void> => {
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

      if (await isPinSet()) {
        res.status(400).json({ message: "PIN is already set" });
        return;
      }

      const hashedPin = await bcrypt.hash(pin, 10);
      await prisma.user.create({
        data: {
          email: req.body.email,
          pin: hashedPin,
        },
      });
      res.json({ message: "Pin set successfully" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
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
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

router.put(
  "/change-pin",
  authenticateToken,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { oldPin, newPin } = req.body;

      if (
        !oldPin ||
        !newPin ||
        typeof oldPin !== "string" ||
        typeof newPin !== "string"
      ) {
        res.status(400).json({ message: "Both PINs must be strings" });
        return;
      }

      if (newPin.length !== MAX_PIN_LENGTH) {
        res.status(400).json({
          message: `New PIN must be exactly ${MAX_PIN_LENGTH} characters long`,
        });
        return;
      }

      if (oldPin === newPin) {
        res.status(400).json({
          message: "New PIN must be different from old PIN",
        });
        return;
      }

      const user = await prisma.user.findFirst();
      if (!user) {
        res.status(404).json({ message: "No user account found" });
        return;
      }

      const isMatch = await bcrypt.compare(oldPin, user.pin);
      if (!isMatch) {
        res.status(401).json({ message: "Incorrect old PIN" });
        return;
      }

      const hashedNewPin = await bcrypt.hash(newPin, 10);
      await prisma.user.update({
        where: { id: user.id },
        data: { pin: hashedNewPin },
      });

      res.json({ message: "PIN updated successfully" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
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
      res.status(400).json({ message: "Both old and new email are required." });
      return;
    }

    try {
      const user = await prisma.user.findFirst({
        where: { email: oldEmail },
      });

      if (!user) {
        res.status(404).json({ message: "Old email not found." });
        return;
      }

      await prisma.user.update({
        where: { id: user.id },
        data: { email: newEmail },
      });

      res.json({ message: "Email updated successfully." });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
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
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
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
    } catch (err) {
      res.sendStatus(403);
    }
  }
);

router.post("/logout", async (req: Request, res: Response): Promise<void> => {
  try {
    res.clearCookie("refresh_token");
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// router.post(
//   "/otp-login",
//   async (req: Request, res: Response): Promise<void> => {
//     const { email } = req.body;

//     const { error } = await supabase.auth.signInWithOtp({
//       email,
//       options: { emailRedirectTo: "http://localhost:5173/otp-callback" },
//     });

//     if (error) {
//       res.status(400).json({ message: error.message });
//       return;
//     }
//     res.status(200).json({ message: "Magic link sent" });
//   }
// );

router.post(
  "/send-otp-email",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { email } = req.body;

      if (!email) {
        res.status(400).json({ message: "Email is required." });
        return;
      }

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        res.status(404).json({ message: "User not found." });
        return;
      }

      const otp = generateOtp();
      const otpExpiry = Date.now() + 10 * 60 * 1000;

      await saveOtpToDatabase(otp, otpExpiry, user.id);

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your OTP Code",
        text: `Your OTP code is: ${otp}`,
      });

      res.status(200).json({ message: "OTP sent successfully", success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to send OTP" });
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
        res.status(404).json({ message: "User not found" });
        return;
      }

      const isMatch = await bcrypt.compare(pin, user.pin);
      if (!isMatch) {
        res.status(401).json({ message: "Invalid PIN" });
        return;
      }

      res.status(200).json({ message: "PIN verified successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to verify PIN" });
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

      res.status(200).json({ message: "Email verified successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to verify email" });
    }
  }
);

router.post(
  "/verify-otp",
  async (req: Request, res: Response): Promise<void> => {
    const { email, otp } = req.body;

    try {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      const otpRecord = await prisma.otp.findFirst({
        where: { userId: user.id, otp },
        orderBy: { createdAt: "desc" },
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

      res.status(200).json({ message: "OTP verified successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to verify OTP" });
    }
  }
);

router.post(
  "/reset-pin",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, newPin } = req.body;

      if (
        !newPin ||
        newPin.length !== MAX_PIN_LENGTH ||
        !/^\d+$/.test(newPin)
      ) {
        res.status(400).json({
          message: `New PIN must be exactly ${MAX_PIN_LENGTH} digits long and only contain numbers.`,
        });
        return;
      }

      const user = await prisma.user.findFirst({ where: { email } });
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      const hashedNewPin = await bcrypt.hash(newPin, 10);

      await prisma.user.update({
        where: { id: user.id },
        data: { pin: hashedNewPin },
      });

      res.json({ message: "PIN reset successfully" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

export default router;

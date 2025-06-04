import express, { Request, Response, Router } from "express";
import dotenv from "dotenv";
import prisma from "../../lib/prisma";
import nodemailer from "nodemailer";
import { generateOtp, saveOtpToDatabase } from "../../lib/otpService";

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
        error:
          process.env.NODE_ENV === "development" ||
          process.env.NODE_ENV === "test"
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
        error:
          process.env.NODE_ENV === "development" ||
          process.env.NODE_ENV === "test"
            ? { message: (error as Error).message }
            : undefined,
      });
      return;
    }
  }
);

export default router;

import express, { Request, Response, Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import prisma from "../lib/prisma";
import nodemailer from "nodemailer";
import { generateOtp, saveOtpToDatabase } from "../lib/otpService";

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

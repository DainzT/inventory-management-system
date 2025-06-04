import express, { Request, Response, Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import prisma from "../../lib/prisma";

import { authenticateToken } from "../../middleware/authMiddleware";

dotenv.config();
const router: Router = express.Router();

const MAX_PIN_LENGTH = 6;

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
  "/reset-pin",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, newPin } = req.body;

      if (!email || typeof email !== "string" || email.trim() === "") {
        res.status(400).json({
          message: "Email is required",
          success: false,
        });
        return;
      }

      if (!newPin || typeof newPin !== "string" || newPin.trim() === "") {
        res.status(400).json({
          message: "PIN is required",
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
      });
      return;
    }
  }
);

export default router;

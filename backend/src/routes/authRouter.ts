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

      const { pin, backupPin, securityQuestions } = req.body;

      if (
        !pin ||
        !backupPin ||
        !securityQuestions ||
        securityQuestions.length !== 3
      ) {
        res.status(400).json({
          message: "All fields are required including 3 security questions",
        });
        return;
      }

      const hashedPin = await bcrypt.hash(pin, 10);
      const hashedBackupPin = await bcrypt.hash(backupPin, 10);

      await prisma.user.create({
        data: {
          pin: hashedPin,
          backupPin: hashedBackupPin,
          securityQuestions,
        },
      });

      res.json({ message: "Admin account created successfully" });
    } catch (error) {
      console.error("Error creating admin:", error);
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
      await prisma.user.create({ data: { pin: hashedPin } });
      res.json({ message: "Pin set successfully" });
    } catch (error) {
      console.error("Error in setup-pin:", error);
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
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.put(
  "/change-pin",
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
      console.error("Change PIN error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

router.get("/check-pin", async (req: Request, res: Response): Promise<void> => {
  try {
    const refreshToken = req.cookies["refresh_token"];
    const user = await prisma.user.findFirst();

    if (!user) {
      res.status(500).json({ message: "No admin found", isPinSet: false });
      return;
    }

    if (!refreshToken) {
      res.json({ isPinSet: true, isAuthenticated: false });
      return;
    }

    try {
      const accessToken = jwt.sign({ userId: user.id }, ACCESS_SECRET, {
        expiresIn: "15m",
      });

      res.json({ isPinSet: true, isAuthenticated: true, token: accessToken });
    } catch (error) {
      res.json({ isPinSet: true, isAuthenticated: false });
    }
  } catch (error) {
    console.error("Check PIN error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/logout", async (req: Request, res: Response): Promise<void> => {
  try {
    res.clearCookie("refresh_token");
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post(
  "/reset-pin-input",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { backupPin, securityAnswers, newPin } = req.body;

      if (!backupPin || !securityAnswers || !newPin) {
        res.status(400).json({ message: "All fields are required" });
        return;
      }

      const user = await prisma.user.findFirst();
      if (!user) {
        res.status(404).json({ message: "No user account found" });
        return;
      }

      if (!user.backupPin) {
        res.status(500).json({ message: "Backup PIN is not set for the user" });
        return;
      }

      const isBackupPinMatch = await bcrypt.compare(backupPin, user.backupPin);
      if (!isBackupPinMatch) {
        res.status(401).json({ message: "Invalid backup PIN" });
        return;
      }

      const storedQuestions = user.securityQuestions as
        | { question: string; answer: string }[]
        | null;

      if (!storedQuestions || !Array.isArray(storedQuestions)) {
        res
          .status(500)
          .json({ message: "Security questions are not properly set" });
        return;
      }

      const isSecurityAnswersMatch = storedQuestions.every((q, i) => {
        return (
          q.answer.trim().toLowerCase() ===
          (securityAnswers[i]?.answer || "").trim().toLowerCase()
        );
      });

      if (!isSecurityAnswersMatch) {
        res.status(401).json({ message: "Invalid security answers" });
        return;
      }

      const hashedNewPin = await bcrypt.hash(newPin, 10);
      await prisma.user.update({
        where: { id: user.id },
        data: { pin: hashedNewPin },
      });

      res.json({ message: "PIN reset successfully" });
    } catch (error) {
      console.error("Forgot PIN error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

router.get(
  "/security-questions",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const admin = await prisma.user.findFirst();
      if (!admin) {
        res.status(404).json({ message: "Admin not found" });
        return;
      }

      res.json({
        questions: Array.isArray(admin.securityQuestions)
          ? admin.securityQuestions
          : [],
      });
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch questions" });
    }
  }
);

export default router;

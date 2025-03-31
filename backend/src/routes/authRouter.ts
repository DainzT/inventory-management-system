import express, { Request, Response, Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import prisma from "../lib/prisma";

dotenv.config();
const router: Router = express.Router();

const SECRET_KEY = process.env.JWT_SECRET;
if (!SECRET_KEY) {
  throw new Error("JWT_SECRET environment variable is not set");
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
  "/setup-pin",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { pin } = req.body;

      if (!pin || typeof pin !== "string") {
        res.status(400).json({ message: "Pin must be a string" });
        return;
      }

      if (pin.length !== MAX_PIN_LENGTH) {
        res.status(400).json({ message: "Pin must be 6 digits" });
        return;
      }

      if (!/^\d+$/.test(pin)) {
        res.status(400).json({ message: "Pin must contain only numbers" });
        return;
      }

      if (await isPinSet()) {
        res.status(400).json({ message: "Pin is already set" });
        return;
      }

      const hashedPin = await bcrypt.hash(pin, 10);
      await prisma.user.create({ data: { pin: hashedPin } });
      res.json({ message: "Pin set successfully" });
      return;
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
      return;
    }
  }
);

router.post("/login", async (req: Request, res: Response): Promise<void> => {
  try {
    const { pin } = req.body;

    if (!pin || typeof pin !== "string") {
      res.status(400).json({ message: "Pin must be a string" });
      return;
    }

    if (pin.length !== MAX_PIN_LENGTH) {
      res.status(400).json({ message: "Pin must be 6 digits" });
      return;
    }

    if (!/^\d+$/.test(pin)) {
      res.status(400).json({ message: "Pin must contain only numbers" });
      return;
    }

    let user;
    try {
      user = await prisma.user.findFirst();
    } catch (dbError) {
      console.error("Database error:", dbError);
      res.status(500).json({ message: "Internal server error" });
      return;
    }
    if (!user) {
      res.status(404).json({ message: "No user account found" });
      return;
    }

    const isMatch = await bcrypt.compare(pin, user.pin);
    if (!isMatch) {
      res.status(401).json({ message: "Invalid PIN" });
      return;
    }

    const token = jwt.sign({ userId: user.id }, SECRET_KEY, {
      expiresIn: "1h",
    });
    res.json({ token });
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
        res.status(400).json({ message: "Both pins must be strings" });
        return;
      }

      if (newPin.length !== MAX_PIN_LENGTH) {
        res.status(400).json({
          message: `New pin must be exactly ${MAX_PIN_LENGTH} characters long`,
        });
        return;
      }

      if (oldPin === newPin) {
        res.status(400).json({
          message: "New pin must be different from old pin",
        });
        return;
      }

      const user = await prisma.user.findFirst();
      if (!user) {
        res.status(404).json({ message: "No user account found" });
        return;
      }

      if (!user) {
        res.status(404).json({ message: "No user account found" });
        return;
      }
      const isMatch = await bcrypt.compare(oldPin, user.pin);
      if (!isMatch) {
        res.status(401).json({ message: "Incorrect old pin" });
        return;
      }

      const hashedNewPin = await bcrypt.hash(newPin, 10);
      await prisma.user.update({
        where: { id: user.id },
        data: { pin: hashedNewPin },
      });
      res.json({ message: "Pin updated successfully" });
      return;
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
      return;
    }
  }
);

router.get("/check-pin", async (req: Request, res: Response) => {
  try {
    const userExists = await prisma.user.count();
    res.json({ isPinSet: userExists > 0 });
    return;
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    return;
  }
});

export default router;

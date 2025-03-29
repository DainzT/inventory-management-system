import express, { Request, Response, Router } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const prisma = new PrismaClient();
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
    console.error("Error checking if pin is set:", error);
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
      }

      if (pin.length !== MAX_PIN_LENGTH) {
        res.status(400).json({ message: "Pin must be 6 digits" });
      }

      if (await isPinSet()) {
        res.status(400).json({ message: "Pin is already set" });
      }

      const hashedPin = await bcrypt.hash(pin, 10);
      await prisma.user.create({ data: { pin: hashedPin } });

      res.json({ message: "Pin set successfully" });
    } catch (error) {
      console.error("Error setting pin:", error);
      res.status(500).json({ message: "Internal server error" });
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

    const user = await prisma.user.findFirst();
    if (!user) {
      console.log("No user found in the database.");
      res.status(404).json({ message: "No user account found" });
      return;
    }

    console.log("User found:", user);
    console.log("Stored Hashed PIN:", user.pin);
    console.log("Entered PIN:", pin);

    const isMatch = await bcrypt.compare(pin, user.pin);
    console.log("bcrypt.compare() result:", isMatch);

    if (!isMatch) {
      console.log("PIN mismatch. Unauthorized.");
      res.status(401).json({ message: "Invalid PIN" });
      return;
    }

    const token = jwt.sign({ userId: user.id }, SECRET_KEY, {
      expiresIn: "1h",
    });
    res.json({ token });
    return;
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
    return;
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
      }

      if (newPin.length !== MAX_PIN_LENGTH) {
        res.status(400).json({
          message: `New pin must be exactly ${MAX_PIN_LENGTH} characters long`,
        });
      }

      if (oldPin === newPin) {
        res.status(400).json({
          message: "New pin must be different from old pin",
        });
      }

      const user = await prisma.user.findFirst();
      if (!user) {
        res.status(404).json({ message: "No user account found" });
      }

      if (!user) {
        res.status(404).json({ message: "No user account found" });
        return;
      }
      const isMatch = await bcrypt.compare(oldPin, user.pin);
      if (!isMatch) {
        res.status(401).json({ message: "Incorrect old pin" });
      }

      const hashedNewPin = await bcrypt.hash(newPin, 10);
      await prisma.user.update({
        where: { id: user.id },
        data: { pin: hashedNewPin },
      });

      res.json({ message: "Pin updated successfully" });
    } catch (error) {
      console.error("Change pin error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

router.get("/check-pin", async (req: Request, res: Response) => {
  try {
    const userExists = await prisma.user.count();
    res.json({ isPinSet: userExists > 0 });
  } catch (error) {
    console.error("Error checking PIN:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;

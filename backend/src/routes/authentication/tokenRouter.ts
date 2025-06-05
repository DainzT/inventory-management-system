import express, { Request, Response, Router } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const router: Router = express.Router();

const ACCESS_SECRET = process.env.ACCESS_SECRET!;
const REFRESH_SECRET = process.env.REFRESH_SECRET!;
if (!ACCESS_SECRET || !REFRESH_SECRET) {
  throw new Error(
    "ACCESS_SECRET or REFRESH_SECRET environment variable is not set"
  );
}

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

export default router;

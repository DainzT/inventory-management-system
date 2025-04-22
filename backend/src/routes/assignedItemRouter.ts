import express, { Router } from "express";
import type { Request, Response } from "express";
import dotenv from "dotenv";
import prisma from "../lib/prisma";
import authenticateToken from "../middleware/authMiddleware";

dotenv.config();
const router: Router = express.Router();

router.use(authenticateToken);

router.get("/assign-item", async (req: Request, res: Response) => {
  try {
    const orders = await prisma.assignedItem.findMany({
      include: {
        fleet: true,
        boat: true,
      },
    });
    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/update-archive", async (req: Request, res: Response) => {
  try {
    const { orders } = req.body;

    console.log("Incoming orders:", orders); // Log the incoming data

    if (!Array.isArray(orders)) {
      res.status(400).json({ message: "Invalid data format" });
      return;
    }

    const updatePromises = orders.map((order) =>
      prisma.assignedItem.update({
        where: { id: order.id },
        data: { archived: order.archived },
      })
    );

    await Promise.all(updatePromises);

    res
      .status(200)
      .json({ success: true, message: "Archived status updated successfully" });
  } catch (error) {
    console.error("Error updating archived status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;

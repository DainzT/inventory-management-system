import express, { Router } from "express";
import type { Request, Response } from "express";
import dotenv from "dotenv";
import prisma from "../lib/prisma";
import authenticateToken from "../middleware/authMiddleware";

dotenv.config();
const router: Router = express.Router();

router.use(authenticateToken);


// Retrieve all orders
router.get("/orders", async (req: Request, res: Response) => {
    try {
        const orders = await prisma.assignedItem.findMany({
            include: {
                item: true,
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


export default router;
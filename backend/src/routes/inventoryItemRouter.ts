import express, { Request, Response, Router } from "express";
import dotenv from "dotenv";
import prisma from "../lib/prisma";
import authenticateToken from "../middleware/authMiddleware"

dotenv.config();
const router: Router = express.Router();

router.use(authenticateToken)

router.get("/get-items", async (req: Request, res: Response) => {
    try {
        const items = await prisma.inventoryItem.findMany();

        if (!items || items.length === 0) {
            res.status(404).json({
                success: false,
                message: "Inventory is empty",
                error: "INVENTORY_EMPTY"
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: items
        });
        return;

    } catch (error) {
        console.error('Error fetching items:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch items from inventory',
            error: process.env.NODE_ENV === 'development' ? error : undefined,
        });
        return;

    }
})

router.post("/add-item", async (req: Request, res: Response) => {
    try {

        const { name, note, quantity, unitPrice, selectUnit, unitSize, total, dateCreated } = req.body;

        if (!name || typeof name !== 'string') {
            res.status(400).json({ error: "Valid name (string) is required" });
            return;
        }

        if (!note || typeof name !== 'string') {
            res.status(400).json({ error: "Valid note (string) is required" });
            return;
        }

        if (!quantity || typeof quantity !== 'number' || quantity <= 0) {
            res.status(400).json({ error: "Valid quantity (number > 0) is required" });
            return;
        }

        if (!unitPrice || typeof unitPrice !== 'number' || quantity <= 0) {
            res.status(400).json({ error: "Valid unitPrice (number) is required" });
            return;
        }

        if (!selectUnit || typeof selectUnit !== 'string') {
            res.status(400).json({ error: "Valid selectUnit (string) is required" });
            return;
        }

        if (!unitSize || typeof unitSize !== 'number' || unitSize <= 0 || unitSize > quantity) {
            res.status(400).json({ error: "Valid unitSize (number > 0 || number > quantity) is required" });
            return;
        }

        if (!total || typeof total !== 'number' || total <= 0 || total != ((unitPrice * quantity) / unitSize)) {
            res.status(400).json({ error: "Valid total (number > 0 ||  total != ((unitPrice * quantity) / unitSize) is required" });
            return;
        }

        if (!dateCreated || isNaN(Date.parse(dateCreated))) {
            res.status(400).json({ error: "Valid dateCreated (ISO 8601 format) is required" });
            return;
        }

        const newItem = await prisma.inventoryItem.create({
            data: {
                name: name,
                note: note,
                quantity: Number(quantity),
                unitPrice: Number(unitPrice),
                selectUnit: selectUnit,
                unitSize: Number(unitSize),
                total: Number(total),
                dateCreated: new Date(dateCreated),
            },
        });

        res.status(201).json({
            success: true,
            message: 'Item added successfully',
            data: newItem
        });
        return;

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to add item to inventory',
            error: process.env.NODE_ENV === 'development' ? error : undefined,
        });
        return;
        
    }
})

// router.delete("/remove-item:id")


// router.put("/update-item:id")

export default router;
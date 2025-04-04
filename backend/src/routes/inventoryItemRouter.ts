import express, { Request, Response, Router } from "express";
import dotenv from "dotenv";
import prisma from "../lib/prisma";
import authenticateToken from "../middleware/authMiddleware"

dotenv.config();
const router: Router = express.Router();

router.use(authenticateToken)

// router.get("/get-item/:id")

router.post("/add-item", async (req: Request, res: Response) => {
    try {

        const { name, note, quantity, unitPrice, selectUnit, unitSize, total, dateCreated} = req.body;
        

        // if (!name || typeof name !== 'string') {
        //     res.status(400).json({ error: "Valid name (string) is required" });
        //     return 
        // }

        // // validate notes

        // if (!quantity || typeof quantity !== 'number' || quantity <= 0) {
        //     res.status(400).json({ error: "Valid quantity (number > 0) is required" });
        //     return;
        // }

        // validate unitPrice

        // validate selectUnit

        // validate unitsize

        // if (!unitPrice || typeof unitPrice !== 'number' || unitPrice <= 0) {
        //     res.status(400).json({ error: "Valid unitPrice (number > 0) is required" });
        //     return 
        // }
        
        //also validate if total is correctly calculated

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
        res.status(500).json({ message: "Internal server error" });
        return;
    }   
})

// router.delete("/remove-item:id")


// router.put("/update-item:id")

export default router;
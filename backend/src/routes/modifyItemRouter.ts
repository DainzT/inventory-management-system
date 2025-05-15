import express, { Request, Response, Router } from "express";
import dotenv from "dotenv";
import prisma from "../lib/prisma";
import { authenticateToken } from "../middleware/authMiddleware";

dotenv.config();
const router: Router = express.Router();

router.use(authenticateToken);

router.put("/update/:id", async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const { quantity, fleet_name, boat_name } = req.body;

        if (typeof quantity !== 'number' || quantity < 0) {
            res.status(400).json({ error: "Valid quantity (number >= 0) is required" });
            return;
        }

        const existingAssignment = await prisma.assignedItem.findUnique({
            where: { id },
            include: {
                fleet: true,
                boat: true
            }
        });

        if (!existingAssignment) {
            res.status(404).json({ success: false, error: "Assigned item not found" });
            return;
        }

        let inventoryItem = await prisma.inventoryItem.findFirst({
            where: {
                name: existingAssignment.name,
                unitSize: existingAssignment.unitSize,
                unitPrice: existingAssignment.unitPrice,
                selectUnit: existingAssignment.selectUnit
            }
        });

        if (quantity === 0) {
            if (!inventoryItem) {
                inventoryItem = await prisma.inventoryItem.create({
                    data: {
                        name: existingAssignment.name,
                        unitSize: existingAssignment.unitSize,
                        unitPrice: existingAssignment.unitPrice,
                        selectUnit: existingAssignment.selectUnit,
                        quantity: existingAssignment.quantity,
                        note: existingAssignment.note || "",
                        total: existingAssignment.total || 0,
                    }
                });
            } else {
                await prisma.inventoryItem.update({
                    where: { id: inventoryItem.id },
                    data: {
                        quantity: inventoryItem.quantity + existingAssignment.quantity
                    }
                });
            }

            await prisma.assignedItem.delete({
                where: { id }
            });

            res.status(200).json({
                success: true,
                deleted: true,
                message: "Assigned item deleted and quantity returned to inventory",
                inventoryItemId: inventoryItem.id,
                restoredQuantity: existingAssignment.quantity
            });
            return;
        }

        const quantityDifference = quantity - existingAssignment.quantity;

        if (quantityDifference !== 0) {
            if (!inventoryItem) {
                inventoryItem = await prisma.inventoryItem.create({
                    data: {
                        name: existingAssignment.name,
                        unitSize: existingAssignment.unitSize,
                        unitPrice: existingAssignment.unitPrice,
                        selectUnit: existingAssignment.selectUnit,
                        quantity: quantityDifference > 0 ? 0 : Math.abs(quantityDifference),
                        note: existingAssignment.note || "",
                        total: existingAssignment.total || 0,
                    }
                });
            } else {
                const newInventoryQuantity = inventoryItem.quantity - quantityDifference;

                if (newInventoryQuantity < 0) {
                    res.status(400).json({ success: false, error: "Insufficient inventory quantity" });
                    return;
                }

                await prisma.inventoryItem.update({
                    where: { id: inventoryItem.id },
                    data: { quantity: newInventoryQuantity }
                });
            }
        }

        const fleet = await prisma.fleet.findFirst({
            where: {
                fleet_name: fleet_name
            }
        });

        if (!fleet) {
            res.status(404).json({ error: "Fleet not found" });
            return;
        }

        const boat = await prisma.boat.findFirst({
            where: {
                boat_name: boat_name,
                fleet_id: fleet.id
            }
        });

        if (!boat) {
            res.status(404).json({ error: "Boat not found or doesn't belong to the specified fleet" });
            return;
        }

        if (fleet.id && boat.id) {
            const boatBelongsToFleet = await prisma.boat.findFirst({
                where: { id: boat.id, fleet }
            });

            if (!boatBelongsToFleet) {
                res.status(400).json({ success: false, error: "Boat does not belong to fleet" });
                return;
            }
        }

        const updatedAssignment = await prisma.assignedItem.update({
            where: { id },
            data: {
                quantity,
                fleet_id: fleet.id,
                boat_id: boat.id,
                lastUpdated: new Date(),
                total: (Number(existingAssignment.unitPrice) * quantity) / Number(existingAssignment.unitSize)
            },
            include: {
                fleet: true,
                boat: true
            }
        });

        res.status(200).json({
            success: true,
            message: "Assigned item updated successfully",
            data: updatedAssignment
        });

    } catch (error) {
        console.error("Error updating assigned item:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update assigned item",
            error: process.env.NODE_ENV === 'development' ? error : undefined,
        });
    }
});


router.delete("/delete/:id", async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);

        const existingAssignment = await prisma.assignedItem.findUnique({
            where: { id }
        });

        if (!existingAssignment) {
            res.status(404).json({ error: "Assigned item not found" });
            return;
        }

        await prisma.assignedItem.delete({
            where: { id }
        });

        res.status(200).json({
            success: true,
            message: 'Assigned item deleted successfully'
        });
        return;

    } catch (error) {
        console.error('Error deleting assigned item:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete assigned item',
            error: process.env.NODE_ENV === 'development' ? error : undefined,
        });
        return;
    }
});

export default router;
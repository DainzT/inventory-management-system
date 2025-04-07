import express, { Request, Response, Router } from "express";
import dotenv from "dotenv";
import prisma from "../lib/prisma";
import authenticateToken from "../middleware/authMiddleware";

dotenv.config();
const router: Router = express.Router();

router.use(authenticateToken);

router.get("/assigned-items", async (req: Request, res: Response) => {
    try {
        const assignedItems = await prisma.assignedItem.findMany({
            include: {
                item: true,
                fleet: true,
                boat: true
            },
            orderBy: {
                outDate: 'desc'
            }
        });

        if (!assignedItems || assignedItems.length === 0) {
            res.status(404).json({
                success: false,
                message: "No assigned items found",
                error: "NO_ASSIGNED_ITEMS"
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: assignedItems
        });
        return;

    } catch (error) {
        console.error('Error fetching assigned items:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch assigned items',
            error: process.env.NODE_ENV === 'development' ? error : undefined,
        });
        return;
    }
});

router.get("/get-fleets-boats", async (req: Request, res: Response) => {
    try {
        const fleets = await prisma.fleet.findMany({
            include: {
                Boat: {
                    select: {
                        id: true,
                        boat_name: true
                    }
                }
            }
        });

        const formattedFleets = fleets.map(fleet => ({
            fleet_name: fleet.fleet_name,
            boats: fleet.Boat.map(boat => boat.boat_name)
        }));

        res.status(200).json({
            success: true,
            data: formattedFleets
        });
        return;

    } catch (error) {
        console.error('Error fetching fleets and boats:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch fleets and boats',
            error: process.env.NODE_ENV === 'development' ? error : undefined,
        });
        return;
    }
});

router.put("/update/:id", async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const { quantity, fleet_id, boat_id, processed } = req.body;

        if (!quantity || typeof quantity !== 'number' || quantity <= 0) {
            res.status(400).json({ error: "Valid quantity (number > 0) is required" });
            return;
        }

        const existingAssignment = await prisma.assignedItem.findUnique({
            where: { id },
            include: { item: true }
        });

        if (!existingAssignment) {
            res.status(404).json({ error: "Assigned item not found" });
            return;
        }

        if (fleet_id) {
            const boatBelongsToFleet = await prisma.boat.findFirst({
                where: {
                    id: boat_id,
                    fleet_id: fleet_id
                }
            });

            if (!boatBelongsToFleet) {
                res.status(400).json({ error: "Boat does not belong to the specified fleet" });
                return;
            }
        }

        if (quantity > existingAssignment.quantity) {
            const inventoryItem = await prisma.inventoryItem.findUnique({
                where: { id: existingAssignment.item_id }
            });

            if (!inventoryItem) {
                res.status(404).json({ error: "Inventory item not found" });
                return;
            }

            const quantityDifference = quantity - existingAssignment.quantity;
            if (quantityDifference > inventoryItem.quantity) {
                res.status(400).json({ 
                    error: "Insufficient stock",
                    available: inventoryItem.quantity,
                    requested: quantityDifference
                });
                return;
            }
        }

        const updatedAssignment = await prisma.assignedItem.update({
            where: { id },
            data: {
                quantity: Number(quantity),
                fleet_id: fleet_id ? Number(fleet_id) : undefined,
                boat_id: boat_id ? Number(boat_id) : undefined,
                processed: processed !== undefined ? Boolean(processed) : undefined,
                lastUpdated: new Date(),
                total: (Number(existingAssignment.item.unitPrice) * quantity) / Number(existingAssignment.item.unitSize)
            },
            include: {
                item: true,
                fleet: true,
                boat: true
            }
        });

        if (quantity !== existingAssignment.quantity) {
            const quantityDifference = existingAssignment.quantity - quantity;
            await prisma.inventoryItem.update({
                where: { id: existingAssignment.item_id },
                data: {
                    quantity: {
                        increment: quantityDifference
                    }
                }
            });
        }

        res.status(200).json({
            success: true,
            message: 'Assigned item updated successfully',
            data: updatedAssignment
        });
        return;

    } catch (error) {
        console.error('Error updating assigned item:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update assigned item',
            error: process.env.NODE_ENV === 'development' ? error : undefined,
        });
        return;
    }
});

router.put("/mark-processed/:id", async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);

        const existingAssignment = await prisma.assignedItem.findUnique({
            where: { id }
        });

        if (!existingAssignment) {
            res.status(404).json({ error: "Assigned item not found" });
            return;
        }

        const updatedAssignment = await prisma.assignedItem.update({
            where: { id },
            data: {
                processed: true,
                lastUpdated: new Date()
            },
            include: {
                item: true,
                fleet: true,
                boat: true
            }
        });

        res.status(200).json({
            success: true,
            message: 'Assigned item marked as processed',
            data: updatedAssignment
        });
        return;

    } catch (error) {
        console.error('Error marking assigned item as processed:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to mark assigned item as processed',
            error: process.env.NODE_ENV === 'development' ? error : undefined,
        });
        return;
    }
});

router.delete("/delete/:id", async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);

        const existingAssignment = await prisma.assignedItem.findUnique({
            where: { id },
            include: { item: true }
        });

        if (!existingAssignment) {
            res.status(404).json({ error: "Assigned item not found" });
            return;
        }

        if (!existingAssignment.processed) {
            await prisma.inventoryItem.update({
                where: { id: existingAssignment.item_id },
                data: {
                    quantity: {
                        increment: existingAssignment.quantity
                    }
                }
            });
        }

        await prisma.assignedItem.delete({
            where: { id }
        });

        res.status(200).json({
            success: true,
            message: 'Assigned item deleted successfully',
            restoredQuantity: !existingAssignment.processed ? existingAssignment.quantity : 0
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
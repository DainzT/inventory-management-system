import express, { Request, Response, Router } from "express";
import dotenv from "dotenv";
import prisma from "../lib/prisma";
import { authenticateToken } from "../middleware/authMiddleware";

dotenv.config();
const router: Router = express.Router();

// router.use(authenticateToken);

router.get("/assigned-items", async (req: Request, res: Response) => {
    try {
        const assignedItems = await prisma.assignedItem.findMany({
            where: {
                archived: false
            },
            include: {
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
            id: fleet.id,
            fleet_name: fleet.fleet_name,
            boats: fleet.Boat.map(boat => ({
                id: boat.id,
                boat_name: boat.boat_name
            }))
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
        const { quantity, fleet_id, boat_id, fleet_name, boat_name, note, archived } = req.body;

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

        const inventoryItem = await prisma.inventoryItem.findFirst({
            where: {
                name: existingAssignment.name,
                unitSize: existingAssignment.unitSize,
                unitPrice: existingAssignment.unitPrice,
                selectUnit: existingAssignment.selectUnit
            }
        });

        if (!inventoryItem) {
            res.status(404).json({ success: false, error: "Inventory item not found" });
            return;
        }

        if (quantity === 0) {
            await prisma.inventoryItem.update({
                where: { id: inventoryItem.id },
                data: {
                    quantity: inventoryItem.quantity + existingAssignment.quantity
                }
            });

            await prisma.assignedItem.delete({
                where: { id }
            });

            res.status(200).json({
                success: true,
                deleted: true,
                message: "Assigned item deleted and quantity restored to inventory",
                inventoryItemId: inventoryItem.id,
                restoredQuantity: existingAssignment.quantity
            });
            return;
        }

        const quantityDifference = quantity - existingAssignment.quantity;

        if (quantityDifference !== 0) {
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

        // Update fleet name if changed
        if (fleet_name && existingAssignment.fleet?.fleet_name !== fleet_name) {
            await prisma.fleet.update({
                where: { id: existingAssignment.fleet_id || undefined },
                data: { fleet_name }
            });
        }

        // Update boat name if changed
        if (boat_name && existingAssignment.boat?.boat_name !== boat_name) {
            await prisma.boat.update({
                where: { id: existingAssignment.boat_id || undefined },
                data: { boat_name }
            });
        }

        // Validate boat belongs to fleet if fleet_id is being updated
        if (fleet_id && boat_id) {
            const boatBelongsToFleet = await prisma.boat.findFirst({
                where: { id: boat_id, fleet_id }
            });

            if (!boatBelongsToFleet) {
                res.status(400).json({ success: false, error: "Boat does not belong to fleet" });
                return;
            }
        }

        // Update the assigned item
        const updatedAssignment = await prisma.assignedItem.update({
            where: { id },
            data: {
                quantity,
                note: note !== undefined ? note : existingAssignment.note,
                fleet_id: fleet_id ? Number(fleet_id) : existingAssignment.fleet_id,
                boat_id: boat_id ? Number(boat_id) : existingAssignment.boat_id,
                archived: archived !== undefined ? Boolean(archived) : existingAssignment.archived,
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


router.put("/archive/:id", async (req: Request, res: Response) => {
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
                archived: true,
                lastUpdated: new Date()
            },
            include: {
                fleet: true,
                boat: true
            }
        });

        res.status(200).json({
            success: true,
            message: 'Assigned item archived successfully',
            data: updatedAssignment
        });
        return;

    } catch (error) {
        console.error('Error archiving assigned item:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to archive assigned item',
            error: process.env.NODE_ENV === 'development' ? error : undefined,
        });
        return;
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
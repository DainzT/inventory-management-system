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
        const { quantity, fleet_id, boat_id, archived } = req.body;

        if (!quantity || typeof quantity !== 'number' || quantity <= 0) {
            res.status(400).json({ error: "Valid quantity (number > 0) is required" });
            return;
        }

        const existingAssignment = await prisma.assignedItem.findUnique({
            where: { id }
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

        const updatedAssignment = await prisma.assignedItem.update({
            where: { id },
            data: {
                quantity: Number(quantity),
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
import express, { Request, Response, Router } from "express";
import dotenv from "dotenv";
import prisma from "../lib/prisma";
import { authenticateToken } from "../middleware/authMiddleware"
import {
    validateAddInventoryItem,
    validateFetchInventoryItems,
    validateAssignInventoryItem,
    validateEditInventoryItem,
    validateDeleteInventoryItem,
} from "../middleware/inventoryItemMiddleware";

dotenv.config();
const router: Router = express.Router();

router.use(authenticateToken)

router.get("/get-items", validateFetchInventoryItems, async (req: Request, res: Response) => {
    try {
        const items = await prisma.inventoryItem.findMany({
            orderBy: {
                dateCreated: 'asc',
            },
        });

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
            error: process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test'
                ? { message: (error as Error).message }
                : undefined,
        });
        return;

    }
})

router.post("/add-item", validateAddInventoryItem, async (req: Request, res: Response) => {
    try {

        const { name, note, quantity, unitPrice, selectUnit, unitSize, total, dateCreated } = req.body;

        const existingItem = await prisma.inventoryItem.findFirst({
            where: {
                name: name,
                selectUnit: selectUnit,
                unitPrice: unitPrice,
                unitSize: unitSize,
            }
        });

        if (existingItem) {
            res.status(409).json({
                success: false,
                message: `Item already exists in inventory`,
                error: 'ITEM_EXISTS',
                existingItem: {
                    id: existingItem.id,
                    name: existingItem.name,
                    quantity: existingItem.quantity,
                    selectUnit: existingItem.selectUnit,
                    unitPrice: existingItem.unitPrice,
                    unitSize: existingItem.unitSize,
                }
            });
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
                lastUpdated: null,
            },
        });

        res.status(201).json({
            success: true,
            message: `Item added successfully`,
            data: newItem
        });
        return;

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to add item to inventory',
            error: process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test'
                ? { message: (error as Error).message }
                : undefined,
        });
        return;

    }
})

router.post("/assign-item", validateAssignInventoryItem, async (req: Request, res: Response) => {
    try {
        const { item_id, note, name, quantity, unitPrice, selectUnit, unitSize, total, fleet_name, boat_name, outDate } = req.body;

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

        const existingAssignment = await prisma.assignedItem.findFirst({
            where: {
                name: name,
                unitPrice: unitPrice,
                selectUnit: selectUnit,
                unitSize: unitSize,
                boat_id: boat.id,
            }
        });

        if (existingAssignment) {
            const updatedAssignment = await prisma.assignedItem.update({
                where: { id: existingAssignment.id },
                data: {
                    quantity: existingAssignment.quantity + Number(quantity),
                    total: existingAssignment.total + Number(total),
                    lastUpdated: new Date(outDate),
                },
                include: {
                    fleet: true,
                    boat: true
                }
            });
            
            await prisma.inventoryItem.update({
                where: { id: item_id.id },
                data: {
                    name: item_id.name,
                    note: item_id.note,
                    quantity: Number(item_id.quantity),
                    unitPrice: Number(item_id.unitPrice),
                    selectUnit: item_id.selectUnit,
                    unitSize: item_id.unitSize,
                    total: Number(item_id.total),
                    lastUpdated: new Date(item_id.lastUpdated),
                }
            });

            res.status(200).json({
                success: true,
                message: `Existing assignment to fleet & boat updated successfully`,
                data: updatedAssignment
            });
            return;
        }

        const newAssignment = await prisma.assignedItem.create({
            data: {
                name: name,
                note: note,
                quantity: Number(quantity),
                unitPrice: Number(unitPrice),
                selectUnit: selectUnit,
                unitSize: Number(unitSize),
                total: Number(total),
                lastUpdated: null,
                outDate: new Date(outDate),
                fleet_id: fleet.id,
                boat_id: boat.id,
                archived: false,
            },
            include: {
                fleet: true,
                boat: true
            }
        });

        await prisma.inventoryItem.update({
            where: { id: item_id.id },
            data: {
                name: item_id.name,
                note: item_id.note,
                quantity: Number(item_id.quantity),
                unitPrice: Number(item_id.unitPrice),
                selectUnit: item_id.selectUnit,
                unitSize: item_id.unitSize,
                total: Number(item_id.total),
                lastUpdated: new Date(item_id.lastUpdated),
            }
        });

        res.status(201).json({
            success: true,
            message: `Item assigned to fleet & boat successfully`,
            data: newAssignment
        });
        return;

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to assign item',
            error: process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test'
                ? { message: (error as Error).message }
                : undefined,
        });
        return;

    }
});

router.delete("/remove-item/:id", validateDeleteInventoryItem, async (req: Request, res: Response) => {
    try {
        const { id } = req.params

        const deletedItem = await prisma.inventoryItem.delete({
            where: { id: Number(id) }
        })

        res.status(200).json({
            success: true,
            message: `Item deleted successfully`,
            data: deletedItem,
        });
        return;

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete item",
            error: process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test'
                ? { message: (error as Error).message }
                : undefined,
        });
    }
});

router.put("/update-item/:id", validateEditInventoryItem, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updatedItem = req.body;

        const item = await prisma.inventoryItem.update({
            where: { id: Number(id) },
            data: {
                name: updatedItem.name,
                note: updatedItem.note,
                quantity: Number(updatedItem.quantity),
                unitPrice: Number(updatedItem.unitPrice),
                selectUnit: updatedItem.selectUnit,
                unitSize: updatedItem.unitSize,
                total: Number(updatedItem.total),
                lastUpdated: new Date(updatedItem.lastUpdated),
            },
        });

        res.status(200).json({
            success: true,
            message: `Inventory item updated successfully.`,
            data: item,
        });
        return;

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to edit item',
            error: process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test'
                ? { message: (error as Error).message }
                : undefined,
        });
        return;
    }
});

export default router;
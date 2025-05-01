import { Request, Response, NextFunction } from 'express';
import prisma from "../lib/prisma";

export function roundTo(num: number, precision: number): number {
    const factor = Math.pow(10, precision);
    return Math.round(num * factor) / factor;
}

export const validateFetchInventoryItems = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {

    const items = await prisma.inventoryItem.findMany();

    if (!items || items.length === 0) {
        res.status(404).json({
            success: false,
            message: "Inventory is empty",
            error: "INVENTORY_EMPTY"
        });
        return;
    }

    next();
}

export const validateAddInventoryItem = (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    const { name, note, quantity, unitPrice, selectUnit, unitSize, total, dateCreated } = req.body;

    if (!name || typeof name !== 'string') {
        res.status(400).json({
            message: "Product name is required.",
            error: "Valid name (string) is required",
        });
        return;
    }

    if (!note || typeof note !== 'string') {
        res.status(400).json({
            message: "Note is required.",
            error: "Valid note (string) is required",
        });
        return;
    }

    if (!quantity || typeof quantity !== 'number' || quantity <= 0) {
        res.status(400).json({
            message: "Enter a valid quantity.",
            error: "Valid quantity (number > 0) is required",
        });
        return;
    }

    if (!unitPrice || typeof unitPrice !== 'number' || unitPrice <= 0) {
        res.status(400).json({
            message: "Enter a valid price.",
            error: "Valid unitPrice (number > 0) is required",
        });
        return;
    }

    if (selectUnit == 'Unit' || typeof selectUnit !== 'string') {
        res.status(400).json({
            message: "Please select a unit.",
            error: "Valid selectUnit (string) is required",
        });
        return;
    }

    if (!unitSize || typeof unitSize !== 'number' || unitSize <= 0 || unitSize > quantity) {
        res.status(400).json({
            message: "Enter a valid unit size.",
            error: "Valid unitSize (number > 0 and number <= quantity) is required",
        });
        return;
    }

    if (!total || typeof total !== 'number' || total <= 0 || total !== roundTo(((unitPrice * quantity) / unitSize), 2)) {
        res.status(400).json({
            message: "Incorrect computed total",
            error: "Valid total (number > 0 and total == ((unitPrice * quantity) / unitSize) is required"
        });
        return;
    }

    if (!dateCreated || isNaN(Date.parse(dateCreated))) {
        res.status(400).json({
            message: "Format Date should be correct",
            error: "Valid dateCreated (ISO 8601 format) is required"
        });
        return;
    }

    next()
}

export const validateAssignInventoryItem = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    const { item_id, note, name, quantity, unitPrice, selectUnit, unitSize, total, fleet_name, boat_name, outDate } = req.body;

    if (!item_id || !note || !name || !unitPrice || !selectUnit || !unitSize || !outDate) {
        res.status(400).json({
            message: "Missing fields",
            error: "Missing required fields"
        });
        return;
    }

    if (!fleet_name || typeof fleet_name !== 'string') {
        res.status(400).json({
            message: "Please select a fleet",
            error: "Valid fleet (string) is required"
        });
        return;
    }

    if (!boat_name || typeof boat_name !== 'string') {
        res.status(400).json({
            message: "Please select a boat",
            error: "Valid boat (string) is required"
        });
        return;
    }

    if (!quantity || typeof quantity !== 'number' || quantity <= 0) {
        res.status(400).json({
            message: "Quantity should not be 0",
            error: "Valid quantity (number > 0) is required"
        });
        return;
    }

    if (!total || typeof total !== 'number' || total <= 0 || total != roundTo(((unitPrice * quantity) / unitSize), 2)) {
        res.status(400).json({
            message: "Incorrect computed total",
            error: "Valid total (number > 0 and total == ((unitPrice * quantity) / unitSize) is required"
        });
        return;
    }

    const item = await prisma.inventoryItem.findUnique({
        where: { id: item_id.id }
    });

    if (!item) {
        res.status(404).json({
            message: "Item does not exist",
            error: "Item not found"
        });
        return;
    }

    if (quantity > item.quantity) {
        res.status(400).json(`Insufficient stock. Requested: ${quantity}, Available: ${item!.quantity}`);
        return;
    }

    next()
}

export const validateDeleteInventoryItem = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const {id} = req.params
    
    const existingItem = await prisma.inventoryItem.findUnique({
        where: { id: Number(id) }
    });

    if (!existingItem) {
        res.status(404).json({
            message: "Nonexistent Item could not be delete",
            error: "Item not found"
        });
        return;
    }

    next();
}

export const validateEditInventoryItem = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    const { id } = req.params;
    const updatedItem = req.body;

    if (!id || isNaN(Number(id))) {
        res.status(400).json({
            message: "Invalid or missing item Id.",
            error: "Valid id (number) is required",
        });
        return;
    }

    if (!updatedItem || Object.keys(updatedItem).length === 0) {
        res.status(400).json({
            message: "Invalid or Missing fields.",
            error: "Valid fields matching the shape of inventoryItem are required.",
        });
        return;
    }

    if (!updatedItem.name || typeof updatedItem.name !== 'string') {
        res.status(400).json({
            message: "Enter a valid name.",
            error: "Valid name (string) is required.",
        });
        return;
    }


    if (!updatedItem.note || typeof updatedItem.note !== 'string') {
        res.status(400).json({
            message: "Enter a valid note.",
            error: "Valid note (string) is required.",
        });
        return;
    }

    if (!updatedItem.quantity || typeof updatedItem.quantity !== 'number') {
        res.status(400).json({
            message: "Enter a valid quantity.",
            error: "Valid quantity (number > 0) is required.",
        });
        return;
    }

    if (!updatedItem.unitPrice || typeof updatedItem.unitPrice !== 'number' || updatedItem.unitPrice <= 0) {
        res.status(400).json({
            message: "Enter a valid price.",
            error: "Valid unitPrice (number > 0) is required",
        });
        return;
    }

    if (updatedItem.selectUnit == 'Unit' || typeof updatedItem.selectUnit !== 'string') {
        res.status(400).json({
            message: "Please select a unit.",
            error: "Valid selectUnit (string) is required",
        });
        return;
    }

    if (!updatedItem.unitSize
        || typeof updatedItem.unitSize !== 'number'
        || updatedItem.unitSize <= 0
        || updatedItem.unitSize > updatedItem.quantity) {
            
        res.status(400).json({
            message: "Enter a valid unit size.",
            error: "Valid unitSize (number > 0 and number <= quantity) is required",
        });
        return;
    }

    if (!updatedItem.total 
        || typeof updatedItem.total !== 'number' 
        || updatedItem.total <= 0
        || updatedItem.total != roundTo(((updatedItem.unitPrice * updatedItem.quantity) / updatedItem.unitSize), 2)) {

        res.status(400).json({
            message: "Incorrect computed total",
            error: "Valid total (number > 0 and total == ((unitPrice * quantity) / unitSize) is required"
        });
        return;
    }

    if (!updatedItem.dateCreated || isNaN(Date.parse(updatedItem.dateCreated))) {
        res.status(400).json({
            message: "Format Date should be correct",
            error: "Valid dateCreated (ISO 8601 format) is required"
        });
        return;
    }

    const existingItem = await prisma.inventoryItem.findUnique({
        where: { id: Number(id) },
    });

    if (!existingItem) {
        res.status(404).json({
            message: "Item not found.",
            error: `No inventory item found with ID ${id}.`,
        });
        return;
    }

    const isUnchanged = Object.entries(updatedItem).every(
        ([key, value]) => {
            if (["dateCreated", "lastUpdated"].includes(key)) return true;
            return existingItem[key as keyof typeof existingItem] === value;
        }
    );

    if (isUnchanged) {
        res.status(400).json({
            message: "No changes detected.",
            error: "The provided data is identical to the existing item.",
        });
        return;
    }

    next();
}



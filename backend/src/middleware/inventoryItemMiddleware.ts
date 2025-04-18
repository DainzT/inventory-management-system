import { Request, Response, NextFunction } from 'express';

export const validateAddInventoryItem = (
    req: Request, 
    res: Response, 
    next: NextFunction
) => {

    const { name, note, quantity, unitPrice, selectUnit, unitSize } = req.body;

    if (!name || typeof name !== 'string') {
        res.status(400).json({
            message: "Product name is required.",
            error: "Valid name (string) is required" 
        });
        return;
    }

    if (!note || typeof note !== 'string') {
        res.status(400).json({
            message: "Note is required.", 
            error: "Valid note (string) is required" 
        });
        return;
    }

    if (!quantity || typeof quantity !== 'number' || quantity <= 0) {
        res.status(400).json({
            message: "Enter a valid quantity.",
            error: "Valid quantity (number > 0) is required" 
        });
        return;
    }

    if (!unitPrice || typeof unitPrice !== 'number' || unitPrice <= 0) {
        res.status(400).json({
            message: "Enter a valid price.",
            error: "Valid unitPrice (number > 0) is required" 
        });
        return;
    }

    if (selectUnit == 'Unit' || typeof selectUnit !== 'string') {
        res.status(400).json({ 
            message: "Please select a unit.",
            error: "Valid selectUnit (string) is required" 
        });
        return;
    }

    if (!unitSize || typeof unitSize !== 'number' || unitSize <= 0 || unitSize > quantity) {
        res.status(400).json({ 
            message: "Enter a valid unit size.",
            error: "Valid unitSize (number > 0 and number <= quantity) is required" 
        });
        return;
    }

    next()
}

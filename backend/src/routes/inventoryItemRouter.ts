import express, { Request, Response, Router } from "express";
import dotenv from "dotenv";
import prisma from "../lib/prisma";
import { authenticateToken } from "../middleware/authMiddleware";
import { validateAddInventoryItem } from "../middleware/inventoryItemMiddleware";

dotenv.config();
const router: Router = express.Router();

router.use(authenticateToken);

router.get("/get-items", async (req: Request, res: Response) => {
  try {
    const items = await prisma.inventoryItem.findMany();

    if (!items || items.length === 0) {
      res.status(404).json({
        success: false,
        message: "Inventory is empty",
        error: "INVENTORY_EMPTY",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: items,
    });
    return;
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch items from inventory",
      error: process.env.NODE_ENV === "development" ? error : undefined,
    });
    return;
  }
});

router.post(
  "/add-item",
  validateAddInventoryItem,
  async (req: Request, res: Response) => {
    try {
      const {
        name,
        note,
        quantity,
        unitPrice,
        selectUnit,
        unitSize,
        total,
        dateCreated,
      } = req.body;

      if (
        !total ||
        typeof total !== "number" ||
        total <= 0 ||
        total != (unitPrice * quantity) / unitSize
      ) {
        res.status(400).json({
          error:
            "Valid total (number > 0 and total == ((unitPrice * quantity) / unitSize) is required",
        });
        return;
      }

      if (!dateCreated || isNaN(Date.parse(dateCreated))) {
        res
          .status(400)
          .json({ error: "Valid dateCreated (ISO 8601 format) is required" });
        return;
      }

      const existingItem = await prisma.inventoryItem.findFirst({
        where: {
          name: name,
          note: note,
          selectUnit: selectUnit,
          unitSize: unitSize,
        },
      });

      if (existingItem) {
        res.status(409).json({
          success: false,
          message: "Item already exists in inventory",
          error: "ITEM_EXISTS",
          existingItem: {
            id: existingItem.id,
            name: existingItem.name,
            note: existingItem.note,
            quantity: existingItem.quantity,
          },
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
        },
      });

      res.status(201).json({
        success: true,
        message: "Item added successfully",
        data: newItem,
      });
      return;
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to add item to inventory",
        error: process.env.NODE_ENV === "development" ? error : undefined,
      });
      return;
    }
  }
);

router.post("/assign-item", async (req: Request, res: Response) => {
  try {
    const {
      item_id,
      note,
      name,
      quantity,
      unitPrice,
      selectUnit,
      unitSize,
      total,
      fleet_name,
      boat_name,
      outDate,
    } = req.body;

    if (
      !item_id ||
      !note ||
      !name ||
      !unitPrice ||
      !selectUnit ||
      !unitSize ||
      !fleet_name ||
      !boat_name ||
      !outDate
    ) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    if (!quantity || typeof quantity !== "number" || quantity <= 0) {
      res
        .status(400)
        .json({ error: "Valid quantity (number > 0) is required" });
      return;
    }

    if (
      !total ||
      typeof total !== "number" ||
      total <= 0 ||
      total != (unitPrice * quantity) / unitSize
    ) {
      res.status(400).json({
        error:
          "Valid total (number > 0 and total == ((unitPrice * quantity) / unitSize) is required",
      });
      return;
    }

    const item = await prisma.inventoryItem.findUnique({
      where: { id: item_id.id },
    });

    if (!item) {
      res.status(404).json({ error: "Item not found" });
      return;
    }

    if (quantity > item!.quantity) {
      res
        .status(400)
        .json(
          `Insufficient stock. Requested: ${quantity}, Available: ${
            item!.quantity
          }`
        );
      return;
    }

    const fleet = await prisma.fleet.findFirst({
      where: {
        fleet_name: fleet_name,
      },
    });

    if (!fleet) {
      res.status(404).json({ error: "Fleet not found" });
      return;
    }

    const boat = await prisma.boat.findFirst({
      where: {
        boat_name: boat_name,
        fleet_id: fleet.id,
      },
    });

    if (!boat) {
      res.status(404).json({
        error: "Boat not found or doesn't belong to the specified fleet",
      });
      return;
    }

    const existingAssignment = await prisma.assignedItem.findFirst({
      where: {
        name: name,
        unitPrice: unitPrice,
        selectUnit: selectUnit,
        unitSize: unitSize,
        boat_id: boat.id,
      },
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
          boat: true,
        },
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
        },
      });

      res.status(200).json({
        success: true,
        message: "Existing assignment updated successfully",
        data: updatedAssignment,
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
        fleet_id: fleet.id,
        boat_id: boat.id,
        archived: false,
        outDate: new Date(outDate),
      },
      include: {
        fleet: true,
        boat: true,
      },
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
      },
    });

    res.status(201).json({
      success: true,
      message: "Item assigned successfully",
      data: newAssignment,
    });
    return;
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to assign item",
      error: process.env.NODE_ENV === "development" ? error : undefined,
    });
    return;
  }
});

// router.delete("/remove-item:id")

// router.put("/update-item:id")

export default router;

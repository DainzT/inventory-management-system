import request from "supertest";
import express from "express";
import prisma from "../../../lib/prisma";
import inventoryItemRouter from "../../../routes/inventoryItemRouter"
import { InventoryItem } from "@prisma/client";

jest.mock("../../../middleware/authMiddleware", () => {
    return {
        authenticateToken: (req: any, res: any, next: any) => next()
    };
});

const app = express();
app.use(express.json())
app.use("/api/inventory-item", inventoryItemRouter)

jest.setTimeout(50000);

describe("DELETE /remove-item/:id - Deletion of Inventory Item", () => {

    beforeAll(async () => {
        await prisma.assignedItem.deleteMany();
        await prisma.inventoryItem.deleteMany();
    });

    afterEach(async () => {
        await prisma.inventoryItem.deleteMany();
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    const baseItem = {
        name: "Test Item",
        note: "Test Note",
        quantity: 5,
        unitPrice: 99.99,
        selectUnit: "pieces",
        unitSize: 1,
        total: 499.95,
        dateCreated: new Date().toISOString()
    };

    let createdItem: InventoryItem

    beforeEach(async () => {
        createdItem = await prisma.inventoryItem.create({
            data: baseItem,
        });
    });

    describe("Happy paths", () => {
        it("should return 200 and delete the item successfully", async () => {
            const response = await request(app)
                .delete(`/api/inventory-item/remove-item/${createdItem.id}`)
                .expect(200);

            expect(response.body).toEqual({
                success: true,
                message: `Item deleted successfully`,
                data: expect.objectContaining({
                    id: createdItem.id,
                    name: createdItem.name,
                    note: createdItem.note,
                    quantity: createdItem.quantity,
                    selectUnit: createdItem.selectUnit,
                    unitPrice: createdItem.unitPrice,
                    unitSize: createdItem.unitSize,
                }),
            });

            const deletedItem = await prisma.inventoryItem.findUnique({
                where: { id: createdItem.id },
            });
            expect(deletedItem).toBeNull();
        });
    });

    describe("Unhappy paths", () => {

        afterEach(() => {
            jest.resetAllMocks();
        });

        it("should return 404 when item to delete does not exist", async () => {
            const nonExistentId = 99999;

            const response = await request(app)
                .delete(`/api/inventory-item/remove-item/${nonExistentId}`)
                .expect(404);

            expect(response.body).toEqual({
                message: "Nonexistent Item could not be delete",
                error: "Item not found",
            });
        });

        it("should return 500 if there is a database error", async () => {
            jest.spyOn(prisma.inventoryItem, "delete").mockRejectedValue(new Error("Database error"));

            const response = await request(app)
                .delete(`/api/inventory-item/remove-item/${createdItem.id}`)
                .expect(500);

            expect(response.body).toEqual({
                success: false,
                message: "Failed to delete item",
                error: process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test" ? {
                    message: "Database error",
                } : undefined,
            });
        });
    });
});
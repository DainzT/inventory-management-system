import request from "supertest";
import express from "express";
import prisma from "../../../lib/prisma";
import inventoryItemRouter from "../../../routes/inventoryItemRouter"
import {
    invalidAddInventoryItemFieldCases,
} from "../../fixtures/inventory/postAddInventoryItemFixtures";

jest.mock("../../../middleware/authMiddleware", () => {
    return {
        authenticateToken: (req: any, res: any, next: any) => next()
    };
});

const app = express();
app.use(express.json())
app.use("/api/inventory-item", inventoryItemRouter)

jest.setTimeout(50000);

describe("POST /add-item - Creation of Inventory Item", () => {

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

    describe("Happy paths", () => {
        it("should create a new inventory item and return 201", async () => {
            const addItem = {
                name: "New Fishing Rod",
                note: "For deep sea fishing",
                quantity: 10,
                unitPrice: 199.99,
                selectUnit: "pieces",
                unitSize: 1,
                total: 1999.90,
                dateCreated: new Date().toISOString()
            }

            const response = await request(app)
                .post("/api/inventory-item/add-item")
                .send(addItem)
                .expect(201);

            // Verify if response is correct
            expect(response.body).toEqual({
                success: true,
                message: `Item added successfully`,
                data: expect.objectContaining({
                    name: addItem.name,
                    note: addItem.note,
                    quantity: addItem.quantity,
                    unitPrice: addItem.unitPrice,
                    selectUnit: addItem.selectUnit,
                    unitSize: addItem.unitSize,
                    total: addItem.total,
                    id: expect.any(Number),
                    dateCreated: addItem.dateCreated,
                })
            });

            // Verify if Item exist
            const createdItem = await prisma.inventoryItem.findUnique({
                where: { id: response.body.data.id }
            });

            expect(createdItem).not.toBeNull();

            // Verify property structure
            const item = response.body.data;
            expect(item).toHaveProperty("name");
            expect(item).toHaveProperty("note");
            expect(item).toHaveProperty("quantity");
            expect(item).toHaveProperty("unitPrice");
            expect(item).toHaveProperty("selectUnit");
            expect(item).toHaveProperty("unitSize");
            expect(item).toHaveProperty("total");
            expect(item).toHaveProperty("dateCreated");

            // Verify data types
            expect(typeof item.name).toBe("string");
            expect(typeof item.note).toBe("string");
            expect(typeof item.quantity).toBe("number");
            expect(typeof item.unitPrice).toBe("number");
            expect(typeof item.selectUnit).toBe("string");
            expect(typeof item.unitSize).toBe("number");
            expect(typeof item.total).toBe("number");
            expect(item.dateCreated).toBeDefined();
            expect(new Date(item.dateCreated)).toBeInstanceOf(Date);
        });
    });

    describe("Unhappy paths", () => {
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

        afterEach(() => {
            jest.resetAllMocks();
        });

        it("should return 409 if item already exists", async () => {
            const existingItem = baseItem

            await prisma.inventoryItem.create({ data: existingItem });

            const response = await request(app)
                .post("/api/inventory-item/add-item")
                .send(existingItem)
                .expect(409);

            expect(response.body).toEqual({
                success: false,
                message: `Item already exists in inventory`,
                error: "ITEM_EXISTS",
                existingItem: expect.objectContaining({
                    name: existingItem.name,
                    quantity: existingItem.quantity,
                    selectUnit: existingItem.selectUnit,
                    unitPrice: existingItem.unitPrice,
                    unitSize: existingItem.unitSize,
                })
            });
        });

        // Verify each fields
        describe.each(invalidAddInventoryItemFieldCases)("Invalid field: $field",
            ({ field, cases }) => {
                it.each(cases.map(c => ({ ...c, field })))(
                    "should return 400 when $field is invalid ($testCase)",
                    async ({ value, expected }) => {
                        const invalidItem = { ...baseItem, [field]: value };

                        const response = await request(app)
                            .post("/api/inventory-item/add-item")
                            .send(invalidItem)
                            .expect(400);

                        expect(response.body).toEqual(expect.objectContaining(expected));
                    }
                );
            });

        it("should return 500 when database operation fails", async () => {
            jest.spyOn(prisma.inventoryItem, "create").mockRejectedValue(
                new Error("Database error")
            );

            const response = await request(app)
                .post("/api/inventory-item/add-item")
                .send(baseItem)
                .expect(500);

            expect(response.body).toEqual({
                success: false,
                message: 'Failed to add item to inventory',
                error: process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test" ? {
                    message: "Database error",
                } : undefined,
            });
        });
    });
});
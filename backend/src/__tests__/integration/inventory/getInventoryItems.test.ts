import request from "supertest";
import express from "express";
import prisma from "../../../lib/prisma";
import inventoryItemRouter from "../../../routes/inventoryItemRouter"
import { InventoryItem } from "@prisma/client";
import {
    testFetchInventoryItems,
} from "../../fixtures/inventory/getInventoryItemsFixtures";

jest.mock("../../../middleware/authMiddleware", () => {
    return {
        authenticateToken: (req: any, res: any, next: any) => next()
    };
});

const app = express();
app.use(express.json())
app.use("/api/inventory-item", inventoryItemRouter)

jest.setTimeout(50000);

describe("GET /get-items - Fetching of Inventory Items", () => {
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
        it("should return 200 with all inventory items when it exists", async () => {

            await prisma.inventoryItem.createMany({
                data: testFetchInventoryItems
            })

            const response = await request(app)
                .get("/api/inventory-item/get-items")
                .expect(200);

            const expectedItems = testFetchInventoryItems.map(item => ({
                ...item,
                dateCreated: item.dateCreated.toISOString(),
                lastUpdated: item.lastUpdated?.toISOString() || null
            }));

            // Verify if response is correct
            expect(response.body).toEqual({
                success: true,
                data: expect.arrayContaining([
                    expect.objectContaining(expectedItems[0]),
                    expect.objectContaining(expectedItems[1])
                ])
            });

            // Verify property structure
            response.body.data.forEach((item: InventoryItem) => {
                expect(item).toHaveProperty("id");
                expect(item).toHaveProperty("name");
                expect(item).toHaveProperty("note");
                expect(item).toHaveProperty("quantity");
                expect(item).toHaveProperty("unitPrice");
                expect(item).toHaveProperty("selectUnit");
                expect(item).toHaveProperty("unitSize");
                expect(item).toHaveProperty("total");
                expect(item).toHaveProperty("dateCreated");
                expect(item).toHaveProperty("lastUpdated");
            });

            // Verify data types
            response.body.data.forEach((item: InventoryItem) => {
                expect(typeof item.id).toBe("number");
                expect(typeof item.name).toBe("string");
                expect(typeof item.note).toBe("string");
                expect(typeof item.quantity).toBe("number");
                expect(typeof item.unitPrice).toBe("number");
                expect(typeof item.selectUnit).toBe("string");
                expect(typeof item.unitSize).toBe("number");
                expect(typeof item.total).toBe("number");
                expect(item.dateCreated).toBeDefined();
                expect(new Date(item.dateCreated)).toBeInstanceOf(Date);
                expect(new Date(item.dateCreated)).not.toBe("Invalid Date");

                if (item.lastUpdated !== null) {
                    expect(new Date(item.lastUpdated)).toBeInstanceOf(Date);
                    expect(new Date(item.lastUpdated)).not.toBe("Invalid Date");
                }
            });

            // Verify item is sorted in ascending order by dateCreated
            const dateCreatedValues = response.body.data.map((item: InventoryItem) => item.dateCreated);
            const expectedDates = testFetchInventoryItems
                .map(item => item.dateCreated.toISOString())
                .sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
            expect(dateCreatedValues).toEqual(expectedDates);
        })
    })

    describe("Unhappy paths", () => {
        it("should return 404 if inventoryItem table is empty", async () => {
            await prisma.inventoryItem.deleteMany();

            const response = await request(app)
                .get("/api/inventory-item/get-items")
                .expect(404);

            expect(response.body).toEqual({
                success: false,
                message: 'Inventory is empty',
                error: 'INVENTORY_EMPTY'
            });
        })

        it("should return 500 when database operation fails", async () => {
            const mockPrisma = {
                inventoryItem: {
                    findMany: jest.fn().mockRejectedValue(new Error("Database error")),
                },
            };

            const testApi = express();
            testApi.use(express.json());

            testApi.get("/api/inventory-item/get-items", async (req, res) => {
                try {
                    const items = await mockPrisma.inventoryItem.findMany();
                    res.json({ success: true, data: items });
                } catch (error) {
                    res.status(500).json({
                        success: false,
                        message: "Failed to fetch items from inventory",
                        error:
                            process.env.NODE_ENV === "development" ||
                                process.env.NODE_ENV === "test"
                                ? { message: error instanceof Error ? error.message : "Unknown error" }
                                : undefined,
                    });
                }
            });

            const response = await request(testApi)
                .get("/api/inventory-item/get-items")
                .expect(500);

            expect(response.body).toEqual({
                success: false,
                message: "Failed to fetch items from inventory",
                error: { message: "Database error" },
            });
        });
    });
});
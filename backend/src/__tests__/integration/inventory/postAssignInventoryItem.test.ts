import request from "supertest";
import express from "express";
import prisma from "../../../lib/prisma";
import inventoryItemRouter from "../../../routes/inventoryItemRouter"
import { InventoryItem } from "@prisma/client";
import {
    InvalidAssignMissingFieldCase,
    invalidAssignInventoryItemFieldCases,
} from "../../fixtures/inventory/postAssignInventoryItemFixtures";

jest.mock("../../../middleware/authMiddleware", () => {
    return {
        authenticateToken: (req: any, res: any, next: any) => next()
    };
});

const app = express();
app.use(express.json())
app.use("/api/inventory-item", inventoryItemRouter)

jest.setTimeout(50000);

describe("POST /assign-item - Assignment of Inventory Item", () => {
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
        quantity: 10,
        unitPrice: 100,
        selectUnit: "kg",
        unitSize: 1,
        total: 1000,
        lastUpdated: new Date().toISOString()
    }

    let createdItem: InventoryItem
    const testFleet = "F/B DONYA DONYA 2x";
    const testBoat = "F/B Mariella";
    const testOutDate = new Date();

    const assignmentQuantity = 2;
    const assignmentTotal = 200;

    describe("Happy paths", () => {

        beforeEach(async () => {
            await prisma.assignedItem.deleteMany();
            createdItem = await prisma.inventoryItem.create({
                data: baseItem,
            });
        });


        it("should return 201 when item is assigned for the first time", async () => {
            const assignmentQuantity = 2;
            const assignmentTotal = 200;

            const response = await request(app)
                .post("/api/inventory-item/assign-item")
                .send({
                    item_id: createdItem,
                    ...baseItem,
                    fleet_name: testFleet,
                    boat_name: testBoat,
                    quantity: assignmentQuantity,
                    total: assignmentTotal,
                    outDate: testOutDate.toISOString(),
                })
                .expect(201);

            const fleet = await prisma.fleet.findFirst({
                where: {
                    fleet_name: testFleet
                }
            });

            if (!fleet) { return }

            const boat = await prisma.boat.findFirst({
                where: {
                    boat_name: testBoat,
                    fleet_id: fleet.id
                }
            });

            const assignedItem = await prisma.assignedItem.findFirst({
                where: {
                    name: baseItem.name,
                    unitPrice: baseItem.unitPrice,
                    selectUnit: baseItem.selectUnit,
                    unitSize: baseItem.unitSize,
                    boat_id: boat?.id
                },
                include: { fleet: true, boat: true }
            });

            expect(response.body).toEqual({
                success: true,
                message: `Item assigned to fleet & boat successfully`,
                data: expect.objectContaining({
                    id: assignedItem?.id,
                    name: baseItem.name,
                    note: baseItem.note,
                    archived: false,
                    quantity: assignmentQuantity,
                    total: assignmentTotal,
                    selectUnit: baseItem.selectUnit,
                    unitPrice: baseItem.unitPrice,
                    unitSize: baseItem.unitSize,
                    outDate: assignedItem?.outDate?.toISOString(),
                    lastUpdated: null,
                    boat_id: boat?.id,
                    fleet_id: fleet.id,
                    fleet: fleet,
                    boat: boat,
                })
            });
        });

        it("should return 200 when updating existing item", async () => {
            const updateQuantity = 3;
            const updateTotal = 300;

            await request(app)
                .post("/api/inventory-item/assign-item")
                .send({
                    item_id: createdItem,
                    ...baseItem,
                    quantity: assignmentQuantity,
                    total: assignmentTotal,
                    fleet_name: testFleet,
                    boat_name: testBoat,
                    outDate: testOutDate,
                });

            const response = await request(app)
                .post("/api/inventory-item/assign-item")
                .send({
                    item_id: createdItem,
                    ...baseItem,
                    quantity: updateQuantity,
                    total: updateTotal,
                    fleet_name: testFleet,
                    boat_name: testBoat,
                    outDate: testOutDate,
                })
                .expect(200);

            const fleet = await prisma.fleet.findFirst({
                where: {
                    fleet_name: testFleet
                }
            });

            if (!fleet) { return }

            const boat = await prisma.boat.findFirst({
                where: {
                    boat_name: testBoat,
                    fleet_id: fleet.id
                }
            });

            const assignedItem = await prisma.assignedItem.findFirst({
                where: {
                    name: baseItem.name,
                    unitPrice: baseItem.unitPrice,
                    selectUnit: baseItem.selectUnit,
                    unitSize: baseItem.unitSize,
                    boat_id: boat?.id
                },
                include: { fleet: true, boat: true }
            });

            expect(response.body).toEqual({
                success: true,
                message: `Existing assignment to fleet & boat updated successfully`,
                data: expect.objectContaining({
                    id: assignedItem?.id,
                    name: baseItem.name,
                    note: baseItem.note,
                    archived: false,
                    quantity: assignmentQuantity + updateQuantity,
                    total: assignmentTotal + updateTotal,
                    selectUnit: baseItem.selectUnit,
                    unitPrice: baseItem.unitPrice,
                    unitSize: baseItem.unitSize,
                    outDate: assignedItem?.outDate?.toISOString(),
                    lastUpdated: assignedItem?.lastUpdated?.toISOString(),
                    boat_id: boat?.id,
                    fleet_id: fleet.id,
                    fleet: fleet,
                    boat: boat,
                })
            });
        })
    })

    describe("Unhappy paths", () => {

        beforeEach(async () => {
            createdItem = await prisma.inventoryItem.create({
                data: baseItem,
            });
        });

        describe.each(invalidAssignInventoryItemFieldCases)("Invalid field: $field",
            ({ field, cases }) => {
                it.each(cases.map(c => ({ ...c, field })))(
                    "should return 400 when $field is invalid ($testCase)",
                    async ({ value, expected }) => {
                        const assignItem = {
                            item_id: createdItem,
                            ...baseItem,
                            fleet_name: testFleet,
                            boat_name: testBoat,
                            quantity: assignmentQuantity,
                            total: assignmentTotal,
                            outDate: testOutDate.toISOString(),
                        }
                        const invalidItem = { ...assignItem, [field]: value };

                        const response = await request(app)
                            .post("/api/inventory-item/assign-item")
                            .send(invalidItem)
                            .expect(400);

                        expect(response.body).toEqual(expect.objectContaining(expected));
                    }
                );
            }
        );

        describe.each(InvalidAssignMissingFieldCase)("$group",
            ({ group, cases }) => {
                it.each(cases.map(c => ({ ...c, group })))(
                    "should return 400 when $field is invalid ($testCase)",
                    async ({ value, expected, field }) => {
                        const assignItem = {
                            item_id: createdItem,
                            ...baseItem,
                            fleet_name: testFleet,
                            boat_name: testBoat,
                            quantity: assignmentQuantity,
                            total: assignmentTotal,
                            outDate: testOutDate.toISOString(),
                        }
                        const invalidItem = { ...assignItem, [field]: value };

                        const response = await request(app)
                            .post("/api/inventory-item/assign-item")
                            .send(invalidItem)
                            .expect(400);

                        expect(response.body).toEqual(expect.objectContaining(expected));
                    }
                );
            }
        );

        it("should return 404 if quantity exceeds available stock", async () => {
            const excessiveQuantity = baseItem.quantity + 1;
            const response = await request(app)
                .post("/api/inventory-item/assign-item")
                .send({
                    item_id: createdItem,
                    ...baseItem,
                    fleet_name: testFleet,
                    boat_name: testBoat,
                    quantity: excessiveQuantity,
                    total: excessiveQuantity * baseItem.unitPrice,
                    outDate: testOutDate
                })
                .expect(400);

            expect(response.text).toContain(
                `Insufficient stock. Requested: ${excessiveQuantity}, Available: ${baseItem.quantity}`
            );
        });

        it("should return 404 if item does not exist", async () => {
            const response = await request(app)
                .post("/api/inventory-item/assign-item")
                .send({
                    item_id: { id: 99999 },
                    ...baseItem,
                    fleet_name: testFleet,
                    boat_name: testBoat,
                    quantity: assignmentQuantity,
                    total: assignmentTotal,
                    outDate: testOutDate
                })
                .expect(404);

            expect(response.body).toEqual({
                message: "Item does not exist",
                error: "Item not found"
            });
        });

        it("should return 500 if database operation fails", async () => {
            jest.spyOn(prisma.inventoryItem, 'update').mockRejectedValue(
                new Error('Database error')
            );

            const response = await request(app)
                .post("/api/inventory-item/assign-item")
                .send({
                    item_id: createdItem,
                    ...baseItem,
                    fleet_name: testFleet,
                    boat_name: testBoat,
                    quantity: assignmentQuantity,
                    total: assignmentTotal,
                    outDate: testOutDate.toISOString(),
                })
                .expect(500);

            expect(response.body).toEqual({
                success: false,
                message: 'Failed to assign item',
                error: process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test" ? {
                    message: "Database error",
                } : undefined,
            });
        });
    });
});

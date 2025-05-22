import request from "supertest";
import express from "express";
import prisma from "../../../lib/prisma";
import inventoryItemRouter from "../../../routes/inventoryItemRouter"
import { InventoryItem } from "@prisma/client";
import {
    invalidEditInventoryItemFieldCases,
    invalidEditBodyInventoryItemFieldCases,
    invalidEditIdInventoryItemFieldCases,
} from "../../fixtures/inventory/putInventoryItemFixtures";

jest.mock("../../../middleware/authMiddleware", () => {
    return {
        authenticateToken: (req: any, res: any, next: any) => next()
    };
});

const app = express();
app.use(express.json())
app.use("/api/inventory-item", inventoryItemRouter)

jest.setTimeout(50000);


describe("PUT /update-item/:id - Editing of Inventory Item", () => {
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
        dateCreated: new Date().toISOString(),
    };

    let createdItem: InventoryItem

    describe("Happy paths", () => {

        beforeEach(async () => {
            createdItem = await prisma.inventoryItem.create({
                data: baseItem,
            });
        });


        it("should return 200 and update the item successfully", async () => {
            const updatedItem = {
                name: "Updated Item",
                note: "Updated Note",
                quantity: 5,
                unitPrice: 99.99,
                selectUnit: "pieces",
                unitSize: 1,
                total: 499.95,
                dateCreated: createdItem.dateCreated.toISOString(),
                lastUpdated: new Date(),
            };

            const response = await request(app)
                .put(`/api/inventory-item/update-item/${createdItem.id}`)
                .send(updatedItem)
                .expect(200);

            const updatedItemId = response.body.data.id;
            expect(updatedItemId).toBe(createdItem.id);

            expect(response.body).toEqual(expect.objectContaining({
                success: true,
                message: `Inventory item updated successfully.`,
                data: expect.objectContaining({
                    id: createdItem.id,
                    name: updatedItem.name,
                    note: updatedItem.note,
                    quantity: updatedItem.quantity,
                    unitPrice: updatedItem.unitPrice,
                    unitSize: updatedItem.unitSize,
                    selectUnit: updatedItem.selectUnit,
                    total: updatedItem.total,
                    lastUpdated: updatedItem.lastUpdated.toISOString(),
                }),
            }));
        });
    });

    describe("Unhappy paths", () => {

        beforeEach(async () => {
            createdItem = await prisma.inventoryItem.create({
                data: baseItem,
            });
        });


        describe.each(invalidEditInventoryItemFieldCases)("Invalid param: $object",
            ({ field, cases, object }) => {
                it.each(cases.map(c => ({ ...c, field, object })))(
                    "should return 400 when $object is invalid ($testCase)",
                    async ({ value, expected }) => {

                        const invalidItem = { ...baseItem, [field]: value, };

                        const response = await request(app)
                            .put(`/api/inventory-item/update-item/${createdItem.id}`)
                            .send(invalidItem)
                            .expect(400);

                        expect(response.body).toEqual(expected);
                    }
                );
            }
        );

        describe.each(invalidEditIdInventoryItemFieldCases)("Invalid param: $field",
            ({ field, cases }) => {
                it.each(cases.map(c => ({ ...c, field })))(
                    "should return 400 when $field is invalid ($testCase)",
                    async ({ id, expected }) => {
                        const response = await request(app)
                            .put(`/api/inventory-item/update-item/${id}`)
                            .send(baseItem)
                            .expect(400);

                        expect(response.body).toEqual(expected);
                    }
                );
            }
        );

        describe.each(invalidEditBodyInventoryItemFieldCases)("Invalid param: $field",
            ({ field, cases }) => {
                it.each(cases.map(c => ({ ...c, field })))(
                    "should return 400 when $field is invalid ($testCase)",
                    async ({ body, expected }) => {

                        const response = await request(app)
                            .put(`/api/inventory-item/update-item/${createdItem.id}`)
                            .send(body)
                            .expect(400);

                        expect(response.body).toEqual(expected);
                    }
                );
            }
        );

        it("should return 404 if item id does not exist", async () => {
            const response = await request(app)
                .put(`/api/inventory-item/update-item/${13414}`)
                .send(baseItem)
                .expect(404);

            expect(response.body).toEqual({
                message: "Item not found.",
                error: `No inventory item found with ID ${13414}.`,
            });
        })

        it('should return 400 if updated item has not change', async () => {
            const response = await request(app)
                .put(`/api/inventory-item/update-item/${createdItem.id}`)
                .send(baseItem)
                .expect(400);

            expect(response.body).toEqual({
                message: "No changes detected.",
                error: "The provided data is identical to the existing item.",
            });
        })

        it("should return 409 if updated item matches with an existing item", async () => {
            const existingItem = await prisma.inventoryItem.create({
                data: {
                    ...baseItem,
                    note: "Existing Duplicate Item",
                }
            });

            const response = await request(app)
                .put(`/api/inventory-item/update-item/${createdItem.id}`)
                .send(existingItem)
                .expect(409);

            expect(response.body).toEqual({
                message: "Duplicate item with matching 'name, unitPrice, unitSize, and selectUnit' found.",
                error: `An item with these properties already exists (ID: ${existingItem.id})`,
                conflictingItem: {
                    id: existingItem.id,
                    name: existingItem.name,
                    unitPrice: existingItem.unitPrice,
                    unitSize: existingItem.unitSize,
                    selectUnit: existingItem.selectUnit
                }
            });
        })

        it("should return 500 if database operation fails", async () => {
            jest.spyOn(prisma.inventoryItem, 'update').mockRejectedValue(
                new Error('Database error')
            );

            const response = await request(app)
                .put(`/api/inventory-item/update-item/${createdItem.id}`)
                .send({
                    ...baseItem,
                    name: "Updated Name"
                })
                .expect(500);

            expect(response.body).toEqual({
                success: false,
                message: 'Failed to edit item',
                error: process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test" ? {
                    message: "Database error",
                } : undefined,
            });
        })
    });
});
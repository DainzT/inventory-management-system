import request from "supertest";
import express from "express";
import prisma from "../../../lib/prisma";
import modifyItemRouter from "../../../routes/modifyItemRouter"

jest.setTimeout(30000);

jest.mock("../../../middleware/authMiddleware", () => {
    return {
        authenticateToken: (req: any, res: any, next: any) => next()
    };
});

const app = express();
app.use(express.json())
app.use("/api/modify-item", modifyItemRouter)

let testItemId: number;

beforeAll(async () => {
    const item = await prisma.assignedItem.create({
        data: {
        name: "Test Lambat",
        unitSize: 1,
        unitPrice: 100,
        selectUnit: "kg",
        quantity: 10,
        note: "Initial",
        fleet_id: 1, 
        boat_id: 1,
        archived: false,
        total: 1000,
        },
    });

    testItemId = item.id;
});

afterAll(async () => {
    await prisma.assignedItem.deleteMany();
    await prisma.inventoryItem.deleteMany();
    await prisma.$disconnect();
});

describe("PUT /modify-item/update/:id", () => {
    describe("Happy Path", () => {
        it("should return 200 and update assigned item with valid data", async () => {
            const res = await request(app)
                .put(`/api/modify-item/update/${testItemId}`) 
                .send({
                    quantity: 5,
                    note: "Initial",
                    fleet_id: 1,
                    boat_id: 1,
                    archived: false,
                });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.quantity).toBe(5);
        }, 15000);

        it("should return 200 and accept decimal numbers for quantity", async () => {
            const res = await request(app)
                .put(`/api/modify-item/update/${testItemId}`)
                .send({
                    quantity: 5.5,
                    note: "Decimal quantity test"
                });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.quantity).toBe(5.5);
            expect(res.body.data.total).toBe(5.5 * 100); 
        }, 10000);

        it("should return 200 and update lastUpdated timestamp when modifying item", async () => {
            const beforeUpdate = new Date();
            
            const res = await request(app)
                .put(`/api/modify-item/update/${testItemId}`)
                .send({
                    quantity: 3,
                });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            
            const lastUpdated = new Date(res.body.data.lastUpdated);
            expect(lastUpdated).toBeInstanceOf(Date);
            expect(lastUpdated.getTime()).toBeGreaterThanOrEqual(beforeUpdate.getTime());
        }, 10000);

        it("should return 200 and recalculate total when quantity changes", async () => {
            const newQuantity = 4;
            const res = await request(app)
                .put(`/api/modify-item/update/${testItemId}`)
                .send({
                    quantity: newQuantity,
                    note: "Updated with new quantity"
                });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.total).toBe(newQuantity * 100);
        }, 15000);

        it("should handle return to inventory with inventory item creation", async () => {
            const assignedItem = await prisma.assignedItem.create({
                data: {
                    name: "New Return Item",
                    unitSize: 1,
                    unitPrice: 100,
                    selectUnit: "kg",
                    quantity: 5,
                    note: "Test automatic inventory creation",
                    fleet_id: 1,
                    boat_id: 1,
                    archived: false,
                    total: 500
                }
            });
            const res = await request(app)
                .put(`/api/modify-item/update/${assignedItem.id}`)
                .send({ quantity: 0 });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.deleted).toBe(true);
            expect(res.body.message).toMatch(/returned to inventory/i);

            const newInventoryItem = await prisma.inventoryItem.findFirst({
                where: {
                    name: "New Return Item",
                    unitPrice: 100,
                    unitSize: 1,
                    selectUnit: "kg"
                }
            });

            expect(newInventoryItem).toBeTruthy();
            expect(newInventoryItem?.quantity).toBe(5);
            expect(newInventoryItem?.total).toBe(500);

            const deletedAssignment = await prisma.assignedItem.findUnique({
                where: { id: assignedItem.id }
            });
            expect(deletedAssignment).toBeNull();

            await prisma.inventoryItem.delete({
                where: { id: newInventoryItem!.id }
            });
        }, 15000);
    });

    describe("Sad Path", () => {
        it("should return 400 for negative quantity", async () => {
            const res = await request(app)
                .put(`/api/modify-item/update/${testItemId}`) 
                .send({ quantity: -10 });
                
            expect(res.status).toBe(400);
            expect(res.body.error).toMatch(/valid quantity/i);
        });

        it("should return 400 when quantity exceeds available inventory", async () => {
            const res = await request(app)
                .put(`/api/modify-item/update/${testItemId}`)
                .send({
                    quantity: 1000,
                    fleet_id: 1,
                    boat_id: 1,
                });

            expect(res.status).toBe(400);
            expect(res.body).toEqual({
                success: false,
                error: "Insufficient inventory quantity"
            });
        });

        it("should return 400 when quantity is not a number", async () => {
            const res = await request(app)
                .put(`/api/modify-item/update/${testItemId}`)
                .send({ quantity: "abc" });

            expect(res.status).toBe(400);
            expect(res.body.error).toMatch("Valid quantity (number >= 0) is required");
        });

        it("should return 400 when quantity field is missing", async () => {
            const res = await request(app)
                .put(`/api/modify-item/update/${testItemId}`)
                .send({});

            expect(res.status).toBe(400);
            expect(res.body.error).toMatch("Valid quantity (number >= 0) is required");
        });

        it("should return 404 if assigned item not found", async () => {
            const res = await request(app)
                .put(`/api/modify-item/update/999999`)  
                .send({ quantity: 5 });

            expect(res.status).toBe(404);
            expect(res.body.error).toMatch(/not found/i);
        });
    });
});
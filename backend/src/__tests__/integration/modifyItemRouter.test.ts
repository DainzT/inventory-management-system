import request from "supertest";
import express from "express";
import prisma from "../../lib/prisma";
import modifyItemRouter from "../../routes/modifyItemRouter"


jest.mock("../../middleware/authMiddleware", () => {
  return {
    authenticateToken: (req: any, res: any, next: any) => next()
  };
});

const app = express();
app.use(express.json())
app.use("/api/modify-item", modifyItemRouter )

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

// afterAll(async () => {
//   await prisma.assignedItem.deleteMany();
//   await prisma.$disconnect();
// });

describe("PUT /modify-item/update/:id", () => {
  it("should update assigned item with valid data", async () => {
    const res = await request(app)
      .put(`/api/modify-item/update/${testItemId}`) 
      .send({
        quantity: 5,
        note: "Updated item",
        fleet_id: 1,
        boat_id: 1,
        archived: false,
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.quantity).toBe(5);
  });

  it("should return 400 for invalid quantity", async () => {
    const res = await request(app)
      .put(`/api/modify-item/update/${testItemId}`) 
      .send({ quantity: -10 });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/valid quantity/i);
  });

  it("should return 404 if assigned item not found", async () => {
    const res = await request(app)
      .put(`/api/modify-item/update/999999`)  
      .send({ quantity: 5 });

    expect(res.status).toBe(404);
    expect(res.body.error).toMatch(/not found/i); 
  });
});

describe("DELETE /api/modify-item/delete/:id", () => {
  let deleteItemId: number;

  beforeAll(async () => {
    const item = await prisma.assignedItem.create({
      data: {
        name: "Delete Me",
        unitSize: 1,
        unitPrice: 50,
        selectUnit: "kg",
        quantity: 3,
        note: "To be deleted",
        fleet_id: 1,
        boat_id: 1,
        archived: false,
        total: 150,
      },
    });

    deleteItemId = item.id;
  });

  it("should delete an existing assigned item", async () => {
    const res = await request(app).delete(`/api/modify-item/delete/${deleteItemId}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toMatch(/deleted successfully/i);
  });

  it("should return 404 for non-existent item", async () => {
    const res = await request(app).delete(`/api/modify-item/delete/999999`);

    expect(res.status).toBe(404);
    expect(res.body.error).toMatch(/not found/i);
  });
});

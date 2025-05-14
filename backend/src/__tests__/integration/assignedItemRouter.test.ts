import request from "supertest";
import express from "express";
import assignItemRoutes from "../../routes/assignedItemRouter";
import prisma from "../../lib/prisma";

// Setup Express app
const app = express();
app.use(express.json());
app.use("/api/assign-item", assignItemRoutes);

// Mock middleware to bypass auth and archival logic
jest.mock("../../middleware/authMiddleware.ts", () => ({
  authenticateToken: (_req: any, _res: any, next: any) => next(),
}));

jest.mock("../../middleware/assignedMiddleware.ts", () => ({
  updateArchivedItems: (_req: any, _res: any, next: any) => next(),
}));

// Mock prisma
jest.mock("../../lib/prisma.ts", () => ({
  __esModule: true,
  default: {
    assignedItem: {
      findMany: jest.fn(),
      update: jest.fn(),
    },
  },
}));


describe("assignItemRoutes", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("GET /assign-item returns unarchived assigned items", async () => {
    const mockItems = [
      {
        id: 1,
        archived: false,
        fleet: { id: 10, name: "Fleet 10" },
        boat: { id: 20, name: "Boat 20" },
      },
    ];

    (prisma.assignedItem.findMany as any).mockResolvedValue(mockItems);

    const res = await request(app).get("/api/assign-item/assign-item");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual(mockItems);
    expect(prisma.assignedItem.findMany).toHaveBeenCalledWith({
      where: { archived: false },
      include: { fleet: true, boat: true },
    });
  });

  it("POST /update-archive updates archived status", async () => {
    const orders = [
      { id: 1, archived: true },
      { id: 2, archived: false },
    ];

    const mockUpdate = jest.spyOn(prisma.assignedItem, "update");

    mockUpdate.mockImplementation(({ where, data }) => {
    return Promise.resolve({
        id: where.id,
        name: "Mock Item",
        note: "Mock note",
        quantity: 1,
        unitPrice: 10,
        selectUnit: "kg",
        unitSize: 1,
        total: 10,
        fleet_id: 1,
        boat_id: 1,
        archived: data.archived,
        fleet: { id: 1, name: "Mock Fleet" },
        boat: { id: 1, name: "Mock Boat" },
        outDate: new Date(),
        lastUpdated: null,
    }) as any;
    });



    const res = await request(app).post("/api/assign-item/update-archive").send({ orders });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Archived status updated successfully");
    expect(mockUpdate).toHaveBeenCalledTimes(2);
    expect(mockUpdate).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { archived: true },
    });
    expect(mockUpdate).toHaveBeenCalledWith({
      where: { id: 2 },
      data: { archived: false },
    });
  });

  it("POST /update-archive returns 400 on invalid data", async () => {
    const res = await request(app).post("/api/assign-item/update-archive").send({ orders: "not-an-array" });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Invalid data format");
  });

  it("GET /assign-item returns 500 on DB error", async () => {
    (prisma.assignedItem.findMany as any).mockRejectedValue(new Error("DB error"));

    const res = await request(app).get("/api/assign-item/assign-item");

    expect(res.status).toBe(500);
    expect(res.body.message).toBe("Internal server error");
  });

  it("POST /update-archive returns 500 on DB update failure", async () => {
    (prisma.assignedItem.update as any).mockRejectedValue(new Error("DB update error"));

    const res = await request(app).post("/api/assign-item/update-archive").send({
      orders: [{ id: 1, archived: true }],
    });

    expect(res.status).toBe(500);
    expect(res.body.message).toBe("Internal server error");
  });
});

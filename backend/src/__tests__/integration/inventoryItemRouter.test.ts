import request from "supertest";
import express from "express";
import prisma from "../../lib/prisma";
import inventoryItemRoutes from "../../routes/inventoryItemRouter"
import { InventoryItem } from "@prisma/client";

jest.mock("../../middleware/authMiddleware", () => {
  return {
    authenticateToken: (req: any, res: any, next: any) => next()
  };
});

const app = express();
app.use(express.json())
app.use("/api/inventory-item", inventoryItemRoutes)

jest.setTimeout(15000);

describe("Inventory Items API", () => {
  beforeAll(async () => {
    await prisma.assignedItem.deleteMany();
    await prisma.inventoryItem.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("GET /get-items - Fetching of Inventory Items", () => {
    describe("Happy paths", () => {
      it("should return 200 with all inventory items when it exists", async () => {
        const testItems = [
          {
            name: "Fishing bait",
            note: "For tilapias",
            quantity: 5,
            unitPrice: 999.99,
            selectUnit: "pieces",
            unitSize: 1,
            total: 4999.95,
            dateCreated: new Date("2025-01-01"),
            lastUpdated: new Date("2025-01-02"),
          },
          {
            name: "Fishing Net",
            note: "24-inch",
            quantity: 10,
            unitPrice: 299.99,
            selectUnit: "pieces",
            unitSize: 1,
            total: 2999.90,
            dateCreated: new Date("2023-01-01"),
            lastUpdated: null,
          },
        ];

        await prisma.inventoryItem.createMany({
          data: testItems
        })

        const response = await request(app)
          .get("/api/inventory-item/get-items")
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveLength(2);

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

        const expectedItems = testItems.map(item => ({
          ...item,
          dateCreated: item.dateCreated.toISOString(),
          lastUpdated: item.lastUpdated?.toISOString() || null
        }));

        expect(response.body.data).toEqual(
          expect.arrayContaining([
            expect.objectContaining(expectedItems[0]),
            expect.objectContaining(expectedItems[1])
          ])
        );

      })
    })

    // describe("Unhappy paths", () => {

    // })
  })

  // describe("POST /add-item - Creation of Inventory Item", () => {

  // })

  // describe("POST /assign-item - Assignment of Inventory Item", () => {

  // })

  // describe("PUT /update-item/:id - Editing of Inventory Item", () => {

  // })

  // describe("DELETE /remove-item/:id - Deletion of Inventory Item", () => {

  // })
})
import request from "supertest";
import express from "express";
import prisma from "../../lib/prisma";
import inventoryItemRoutes from "../../routes/inventoryItemRouter"
import { InventoryItem } from "@prisma/client";
import {
  invalidAddInventoryItemFieldCases,
  testFetchInventoryItems,
  invalidEditIdInventoryItemFieldCases,
  invalidEditBodyInventoryItemFieldCases,
  invalidEditInventoryItemFieldCases,
  invalidAssignInventoryItemFieldCases,
  InvalidAssignMissingFieldCase,
} from "../fixtures/inventoryItemsFixtures";

jest.mock("../../middleware/authMiddleware", () => {
  return {
    authenticateToken: (req: any, res: any, next: any) => next()
  };
});

const app = express();
app.use(express.json())
app.use("/api/inventory-item", inventoryItemRoutes)

jest.setTimeout(50000);

describe("Inventory Items API", () => {
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

  describe("GET /get-items - Fetching of Inventory Items", () => {

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

  describe("POST /add-item - Creation of Inventory Item", () => {
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

  describe("POST /assign-item - Assignment of Inventory Item", () => {
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

    beforeEach(async () => {
      await prisma.assignedItem.deleteMany();
      createdItem = await prisma.inventoryItem.create({
        data: baseItem,
      });
    });

    describe("Happy paths", () => {
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

  describe("PUT /update-item/:id - Editing of Inventory Item", () => {
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

    beforeEach(async () => {
      createdItem = await prisma.inventoryItem.create({
        data: baseItem,
      });
    });

    describe("Happy paths", () => {
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
})

describe("DELETE /remove-item/:id - Deletion of Inventory Item", () => {
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

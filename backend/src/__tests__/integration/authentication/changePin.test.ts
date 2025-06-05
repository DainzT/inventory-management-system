import request from "supertest";
import express from "express";
import pinRoutes from "../../../routes/authentication/pinRouter";
import prisma from "../../../lib/prisma";
import bcrypt from "bcrypt";

jest.mock("../../../middleware/authMiddleware", () => ({
  authenticateToken: (req: any, res: any, next: any) => {
    req.user = { userId: 1 };
    next();
  },
}));

const app = express();
app.use(express.json());
app.use("/api/pin", pinRoutes);

jest.setTimeout(90000);

describe("PUT /api/pin/change-pin", () => {
  let user: any;

  beforeAll(async () => {
    await prisma.otp.deleteMany();
    await prisma.user.deleteMany();
    user = await prisma.user.create({
      data: {
        id: 1,
        email: "test@example.com",
        pin: await bcrypt.hash("123456", 10),
      },
    });
  });

  afterAll(async () => {
    await prisma.otp.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  it("should successfully change PIN with valid credentials", async () => {
    const response = await request(app)
      .put("/api/pin/change-pin")
      .send({ oldPin: "123456", newPin: "654321" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "PIN updated successfully",
      success: true,
    });

    const updatedUser = await prisma.user.findUnique({
      where: { id: user.id },
    });
    expect(await bcrypt.compare("654321", updatedUser?.pin || "")).toBe(true);
  });

  it("should return 400 for invalid new PIN format", async () => {
    const testCases = [
      { pin: "12345", message: "New PIN must be exactly 6 characters long" },
      { pin: "", message: "PIN is required." },
    ];

    for (const testCase of testCases) {
      const response = await request(app)
        .put("/api/pin/change-pin")
        .send({ oldPin: "123456", newPin: testCase.pin });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message", testCase.message);
    }
  });

  it("should return 400 without authentication", async () => {
    const response = await request(app)
      .put("/api/pin/change-pin")
      .send({ oldPin: "", newPin: "" });

    expect(response.status).toBe(400);
  });
});

describe("PUT /api/pin/change-pin (Negative Cases)", () => {
  it("should return 404 with invalid authentication", async () => {
    jest.mock("../../../middleware/authMiddleware", () => ({
      authenticateToken: (req: any, res: any) =>
        res.status(404).json({ message: "Not found" }),
    }));

    const response = await request(app)
      .put("/api/pin/change-pin")
      .send({ oldPin: "123456", newPin: "654321" });

    expect(response.status).toBe(404);
    jest.restoreAllMocks();
  });

  it("should return 404 when user doesn't exist", async () => {
    await prisma.user.deleteMany();

    const response = await request(app)
      .put("/api/pin/change-pin")
      .send({ oldPin: "123456", newPin: "654321" });

    expect(response.status).toBe(404);
  });

  it("should return 404 when oldPin is missing", async () => {
    const response = await request(app)
      .put("/api/pin/change-pin")
      .send({ newPin: "654321" });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      message: "No user account found",
      success: false,
    });
  });

  it("should return 400 when newPin is missing", async () => {
    const response = await request(app)
      .put("/api/pin/change-pin")
      .send({ oldPin: "123456" });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "PIN is required.",
      success: false,
    });
  });

  it("should handle authentication failure", async () => {
    jest.mock("../../../middleware/authMiddleware", () => ({
      authenticateToken: (req: any, res: any, next: any) => {
        return res.status(401).json({ message: "Unauthorized" });
      },
    }));

    const response = await request(app)
      .put("/api/pin/change-pin")
      .send({ oldPin: "123456", newPin: "654321" });

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message");

    jest.restoreAllMocks();
  });
});

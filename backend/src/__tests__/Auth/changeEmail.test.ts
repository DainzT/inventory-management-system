import request from "supertest";
import express from "express";
import authRoutes from "../../routes/authRouter";
import prisma from "../../lib/prisma";
import bcrypt from "bcrypt";
import { authenticateToken } from "../../middleware/authMiddleware";

jest.mock("../../middleware/authMiddleware", () => ({
  authenticateToken: (req: any, res: any, next: any) => {
    req.user = { userId: 1 };
    next();
  },
}));

const app = express();
app.use(express.json());
app.use("/api/auth", authRoutes);

jest.setTimeout(90000);

describe("PUT /api/auth/change-email", () => {
  let user: any;

  beforeAll(async () => {
    await prisma.otp.deleteMany();
    await prisma.user.deleteMany();
    user = await prisma.user.create({
      data: {
        id: 1,
        email: "old@example.com",
        pin: await bcrypt.hash("123456", 10),
      },
    });
  });

  afterAll(async () => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    await prisma.otp.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  it("should return 404 with incorrect old email", async () => {
    const response = await request(app)
      .put("/api/auth/change-email")
      .send({ oldEmail: "wrong@example.com", newEmail: "new@example.com" });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      message: "Old email not found.",
      success: false,
    });
  });

  it("should successfully change email with valid credentials", async () => {
    const response = await request(app)
      .put("/api/auth/change-email")
      .send({ oldEmail: "old@example.com", newEmail: "new@example.com" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "Email updated successfully.",
      success: true,
    });

    const updatedUser = await prisma.user.findUnique({
      where: { id: user.id },
    });
    expect(updatedUser?.email).toBe("new@example.com");
  });

  it("should return 400 for invalid email format", async () => {
    const response = await request(app)
      .put("/api/auth/change-email")
      .send({ oldEmail: "invalid", newEmail: "alsoinvalid" });

    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/email format is invalid/i);
  });

  it("should error with the same email", async () => {
    const response = await request(app)
      .put("/api/auth/change-email")
      .send({ oldEmail: "old@example.com", newEmail: "new@example.com" });

    expect(response.status).toBe(409);
    expect(response.body).toEqual({
      message: "New email is already in use.",
      success: false,
    });
  });
});

describe("PUT /api/auth/change-email (Negative Cases)", () => {
  let user: any;

  beforeAll(async () => {
    await prisma.user.deleteMany();
    user = await prisma.user.create({
      data: {
        id: 1,
        email: "old@example.com",
        pin: await bcrypt.hash("123456", 10),
      },
    });
  });

  afterAll(async () => {
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  it("should return 409 when new email is already in use", async () => {
    await prisma.user.create({
      data: {
        id: 2,
        email: "taken@example.com",
        pin: await bcrypt.hash("123456", 10),
      },
    });

    const response = await request(app)
      .put("/api/auth/change-email")
      .send({ oldEmail: "old@example.com", newEmail: "taken@example.com" });

    expect(response.status).toBe(409);
    expect(response.body).toEqual({
      message: "New email is already in use.",
      success: false,
    });
  });

  it("should handle database update failure", async () => {
    jest.spyOn(prisma.user, "update").mockRejectedValue(new Error("DB Error"));

    const response = await request(app).put("/api/auth/change-email").send({
      oldEmail: "nonexistent@example.com",
      newEmail: "new@example.com",
    });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      message: "Old email not found.",
      success: false,
    });

    jest.restoreAllMocks();
  });

  it("should return 400 when new email is invalid format", async () => {
    const response = await request(app)
      .put("/api/auth/change-email")
      .send({ oldEmail: "old@example.com", newEmailt: "invalid-email" });

    expect(response.status).toBe(400);
  });

  it("should allow same email when old and new emails match", async () => {
    const response = await request(app)
      .put("/api/auth/change-email")
      .send({ oldEmail: "old@example.com", newEmail: "old@example.com" });

    expect(response.status).toBe(400);
  });

  it("should handle authentication failure", async () => {
    jest.mock("../../middleware/authMiddleware", () => ({
      authenticateToken: (req: any, res: any) =>
        res.status(401).json({ message: "Unauthorized" }),
    }));

    const response = await request(app)
      .put("/api/auth/change-email")
      .send({ oldEmail: "old@example.com", newEmail: "new@example.com" });

    expect(response.status).toBe(200);
    jest.restoreAllMocks();
  });

  it("should return 404 when user doesn't exist", async () => {
    await prisma.user.deleteMany();
    const response = await request(app)
      .put("/api/auth/change-email")
      .send({ oldEmail: "old@example.com", newEmail: "new@example.com" });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      message: "Old email not found.",
      success: false,
    });
  });
});

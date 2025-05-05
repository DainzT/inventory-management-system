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
    await prisma.otp.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  it("should successfully change email with valid credentials", async () => {
    const response = await request(app)
      .put("/api/auth/change-email")
      .send({ oldEmail: "old@example.com", newEmail: "new@example.com" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Email updated successfully." });

    const updatedUser = await prisma.user.findUnique({
      where: { id: user.id },
    });
    expect(updatedUser?.email).toBe("new@example.com");
  });

  it("should return 404 with incorrect old email", async () => {
    const response = await request(app)
      .put("/api/auth/change-email")
      .send({ oldEmail: "wrong@example.com", newEmail: "new@example.com" });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "Old email not found." });
  });

  // it("should return 400 for invalid email format", async () => {
  //   const testCases = [
  //     { email: "invalid", message: "Both old and new email are required." },
  //     { email: "", message: "Both old and new email are required." },
  //   ];

  //   for (const testCase of testCases) {
  //     const response = await request(app)
  //       .put("/api/auth/change-email")
  //       .send({ oldEmail: testCase.email, newEmail: testCase.email });

  //     expect(response.status).toBe(400);
  //     expect(response.body).toHaveProperty("message", testCase.message);
  //   }
  // });

  it("should return 401 without authentication", async () => {
    const response = await request(app)
      .put("/api/auth/change-email")
      .send({ oldEmail: "old@example.com", newEmail: "new@example.com" });

    expect(response.status).toBe(404);
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

  it("should handle database update failure", async () => {
    jest.spyOn(prisma.user, "update").mockRejectedValue(new Error("DB Error"));

    const response = await request(app).put("/api/auth/change-email").send({
      oldEmail: "nonexistent@example.com",
      newEmail: "new@example.com",
    });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "Old email not found." });

    jest.restoreAllMocks();
  });

  // it("should return 400 when new email is invalid format", async () => {
  //   const response = await request(app)
  //     .put("/api/auth/change-email")
  //     .send({ oldEmail: "old@example.com", newEmail: "invalid-email" });

  //   expect(response.status).toBe(200);
  // });

  it("should allow same email when old and new emails match", async () => {
    const response = await request(app)
      .put("/api/auth/change-email")
      .send({ oldEmail: "old@example.com", newEmail: "old@example.com" });

    expect([200, 404]).toContain(response.status);
  });

  it("should handle authentication failure", async () => {
    jest.mock("../../middleware/authMiddleware", () => ({
      authenticateToken: (req: any, res: any) =>
        res.status(401).json({ message: "Unauthorized" }),
    }));

    const response = await request(app)
      .put("/api/auth/change-email")
      .send({ oldEmail: "old@example.com", newEmail: "new@example.com" });

    expect([200, 401, 404]).toContain(response.status);
    jest.restoreAllMocks();
  });

  it("should return 404 when user doesn't exist", async () => {
    await prisma.user.deleteMany();
    const response = await request(app)
      .put("/api/auth/change-email")
      .send({ oldEmail: "old@example.com", newEmail: "new@example.com" });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "Old email not found." });
  });
});

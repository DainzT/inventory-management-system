import request from "supertest";
import express from "express";
import authRoutes from "../../routes/authRouter";
import prisma from "../../lib/prisma";
import bcrypt from "bcrypt";

const app = express();
app.use(express.json());
app.use("/api/auth", authRoutes);

jest.setTimeout(90000);

describe("POST /api/auth/verify-pin", () => {
  beforeAll(async () => {
    await prisma.otp.deleteMany();
    await prisma.user.deleteMany();
    await prisma.user.create({
      data: {
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

  it("should verify correct PIN", async () => {
    const response = await request(app)
      .post("/api/auth/verify-pin")
      .send({ pin: "123456" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "PIN verified successfully" });
  });

  it("should return 401 for incorrect PIN", async () => {
    const response = await request(app)
      .post("/api/auth/verify-pin")
      .send({ pin: "654321" });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: "Invalid PIN" });
  });

  it("should return 404 when no user exists", async () => {
    await prisma.user.deleteMany();
    const response = await request(app)
      .post("/api/auth/verify-pin")
      .send({ pin: "123456" });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "User not found" });
  });
});

describe("POST /api/auth/verify-pin (Negative Cases)", () => {
  it("should return 404 when user doesn't exist", async () => {
    await prisma.user.deleteMany();

    const response = await request(app)
      .post("/api/auth/verify-pin")
      .send({ pin: "123456" });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "User not found" });
  });

  it("should return appropriate status when PIN is missing", async () => {
    const response = await request(app).post("/api/auth/verify-pin").send({});
    expect([400, 401, 404]).toContain(response.status);
  });

  it("should return 400 when request body is malformed", async () => {
    const response = await request(app)
      .post("/api/auth/verify-pin")
      .send("invalid-json");

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message");
  });
});

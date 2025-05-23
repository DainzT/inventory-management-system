import request from "supertest";
import express from "express";
import authRoutes from "../../../routes/authRouter";
import prisma from "../../../lib/prisma";
import bcrypt from "bcrypt";

const app = express();
app.use(express.json());
app.use("/api/auth", authRoutes);

jest.setTimeout(90000);

describe("POST /api/auth/verify-email", () => {
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

  it("should verify correct email", async () => {
    const response = await request(app)
      .post("/api/auth/verify-email")
      .send({ email: "test@example.com" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "OTP sent successfully",
      success: true,
    });
  });

  it("should return 400 for incorrect email", async () => {
    const response = await request(app)
      .post("/api/auth/verify-email")
      .send({ email: "wrong@example.com" });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Invalid email address" });
  });

  it("should return 400 for empty email", async () => {
    const response = await request(app)
      .post("/api/auth/verify-email")
      .send({ email: "" });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Invalid email address" });
  });
});

describe("POST /api/auth/verify-email (Negative Cases)", () => {
  it("should return 500 when database query fails", async () => {
    jest
      .spyOn(prisma.user, "findFirst")
      .mockRejectedValue(new Error("DB Error"));

    const response = await request(app)
      .post("/api/auth/verify-email")
      .send({ email: "test@example.com" });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      message: "Failed to verify email",
      success: false,
    });

    jest.restoreAllMocks();
  });

  it("should return 400 when email is missing", async () => {
    const response = await request(app).post("/api/auth/verify-email").send({});

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Invalid email address" });
  });

  it("should return 400 when request body is malformed", async () => {
    const response = await request(app)
      .post("/api/auth/verify-email")
      .send("invalid-json");

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
  });
});

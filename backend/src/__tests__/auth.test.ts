import request from "supertest";
import express from "express";
import authRoutes from "../routes/authRouter";
import prisma from "../lib/prisma";
import bcrypt from "bcrypt";

const app = express();
app.use(express.json());
app.use("/api/auth", authRoutes);

jest.setTimeout(15000);

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(() => "mocked-jwt-token"),
}));

describe("POST /api/auth/login (Negative Cases)", () => {
  beforeAll(async () => {
    await prisma.user.deleteMany();
    await prisma.user.create({
      data: {
        id: "test-user-id",
        pin: await bcrypt.hash("654321", 10),
        createdAt: new Date(),
      },
    });
  });

  afterAll(async () => {
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  it("should handle database connection failure", async () => {
    jest
      .spyOn(prisma.user, "findFirst")
      .mockRejectedValue(new Error("DB Failure"));

    const response = await request(app)
      .post("/api/auth/login")
      .send({ pin: "123456" });

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("message", "Internal server error");

    jest.restoreAllMocks();
  });

  it("should return a token for valid PIN", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({ pin: "654321" });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token", "mocked-jwt-token");
  });

  it("should return 401 for incorrect PIN", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({ pin: "121212" });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid PIN");
  });

  it("should return 400 if no PIN is provided", async () => {
    const response = await request(app).post("/api/auth/login").send({});
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Pin must be a string");
  });

  it("should return 400 if PIN is too short", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({ pin: "12" });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Pin must be 6 digits");
  });

  it("should return 400 if PIN contains invalid characters", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({ pin: "abc@12" });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "message",
      "Pin must contain only numbers"
    );
  });

  it("should return 404 if no user is found", async () => {
    await prisma.user.deleteMany();

    const response = await request(app)
      .post("/api/auth/login")
      .send({ pin: "123456" });

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "No user account found");
  });

  it("should return 400 for malformed request (not an object)", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send("invalid body");

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Pin must be a string");
  });

  it("should return 400 if PIN is null", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({ pin: null });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Pin must be a string");
  });
});

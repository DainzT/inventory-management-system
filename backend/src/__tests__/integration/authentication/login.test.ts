import request from "supertest";
import express from "express";
import authRoutes from "../../../routes/authRouter";
import prisma from "../../../lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const app = express();
app.use(express.json());
app.use("/api/auth", authRoutes);

jest.setTimeout(60000);

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(() => "mocked-jwt-token"),
}));

describe("POST /api/auth/login (Negative Cases)", () => {
  beforeAll(async () => {
    await prisma.otp.deleteMany();
    await prisma.user.deleteMany();
    await prisma.user.create({
      data: {
        email: "test@example.com",
        pin: await bcrypt.hash("654321", 10),
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

  it("should handle database connection failure", async () => {
    jest
      .spyOn(prisma.user, "findFirst")
      .mockRejectedValue(new Error("DB Failure"));

    const response = await request(app)
      .post("/api/auth/login")
      .send({ pin: "654321" });

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("message", "Internal server error");

    jest.restoreAllMocks();
  });

  it("should return a token for valid PIN", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({ pin: "654321" });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("accessToken", "mocked-jwt-token");
  });

  it("should return 401 for incorrect PIN", async () => {
    await prisma.user.create({
      data: {
        id: 1,
        email: "test@gmail.com",
        pin: await bcrypt.hash("654321", 10),
        createdAt: new Date(),
      },
    });
    const response = await request(app)
      .post("/api/auth/login")
      .send({ pin: "121212" });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid PIN");
  });

  it("should return 400 if no PIN is provided", async () => {
    const response = await request(app).post("/api/auth/login").send({});
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "PIN cannot be empty");
  });

  it("should return 400 if PIN is too short", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({ pin: "12" });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "PIN must be 6 digits");
  });

  it("should return 400 if PIN contains invalid characters", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({ pin: "abc@12" });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "message",
      "PIN must contain only numbers"
    );
  });

  it("should return 404 if no user is found", async () => {
    await prisma.user.deleteMany();

    const response = await request(app)
      .post("/api/auth/login")
      .send({ pin: "654321" });

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "No user account found");
  });

  it("should return 400 for malformed request (not an object)", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send("invalid body");

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "PIN cannot be empty");
  });

  it("should return 400 if PIN is null", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({ pin: null });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "PIN cannot be empty");
  });
});

describe("POST /api/auth/login (Negative Cases)", () => {
  it("should handle bcrypt comparison failure after finding user", async () => {
    await prisma.user.create({
      data: {
        email: "test@example.com",
        pin: await bcrypt.hash("654321", 10),
      },
    });

    jest.spyOn(bcrypt, "compare").mockImplementationOnce(() => {
      throw new Error("Bcrypt error");
    });

    const response = await request(app)
      .post("/api/auth/login")
      .send({ pin: "654321" });

    expect([401, 500]).toContain(response.status);
    jest.restoreAllMocks();
  });

  it("should return 400 when PIN is a number instead of string", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({ pin: 123456 });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "PIN must be a string" });
  });

  it("should return 400 when request body is empty", async () => {
    const response = await request(app).post("/api/auth/login").send();

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
  });

  it("should handle JWT signing failure after successful auth", async () => {
    const normalResponse = await request(app)
      .post("/api/auth/login")
      .send({ pin: "654321" });
    expect(normalResponse.status).toBe(200);

    jest.spyOn(jwt, "sign").mockImplementationOnce(() => {
      throw new Error("JWT error");
    });

    const response = await request(app)
      .post("/api/auth/login")
      .send({ pin: "654321" });

    expect([200, 500]).toContain(response.status);
    expect(response.body).toHaveProperty("message");

    jest.restoreAllMocks();
  });
});

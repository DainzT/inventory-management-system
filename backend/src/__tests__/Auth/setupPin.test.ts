import request from "supertest";
import express from "express";
import authRoutes from "../../routes/authRouter";
import prisma from "../../lib/prisma";
import bcrypt from "bcrypt";

const app = express();
app.use(express.json());
app.use("/api/auth", authRoutes);

jest.setTimeout(90000);

describe("POST /api/auth/setup-pin", () => {
  beforeEach(async () => {
    await prisma.otp.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.otp.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  it("should successfully set PIN when no user exists", async () => {
    const response = await request(app)
      .post("/api/auth/setup-pin")
      .send({ email: "admin@example.com", pin: "123456" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Pin set successfully" });

    const user = await prisma.user.findFirst();
    expect(user).toBeTruthy();
    expect(await bcrypt.compare("123456", user?.pin || "")).toBe(true);
  });

  it("should return 400 if PIN is already set", async () => {
    await request(app)
      .post("/api/auth/setup-pin")
      .send({ email: "admin@example.com", pin: "123456" });

    const response = await request(app)
      .post("/api/auth/setup-pin")
      .send({ email: "admin2@example.com", pin: "654321" });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "PIN is already set" });
  });

  it("should return 400 if PIN is not 6 digits", async () => {
    const testCases = [
      { pin: "12345", expected: "PIN must be 6 digits" },
      { pin: "1234567", expected: "PIN must be 6 digits" },
    ];

    for (const testCase of testCases) {
      const response = await request(app)
        .post("/api/auth/setup-pin")
        .send({ email: "admin@example.com", pin: testCase.pin });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: testCase.expected });
    }
  });

  it("should return 400 if PIN contains non-digits", async () => {
    const testCases = [
      { pin: "12a456", expected: "PIN must contain only numbers" },
      { pin: "abcdef", expected: "PIN must contain only numbers" },
      { pin: "!@#$%^", expected: "PIN must contain only numbers" },
    ];

    for (const testCase of testCases) {
      const response = await request(app)
        .post("/api/auth/setup-pin")
        .send({ email: "admin@example.com", pin: testCase.pin });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: testCase.expected });
    }
  });

  it("should return 400 if PIN is empty", async () => {
    const testCases = [
      { pin: "", expected: "PIN cannot be empty" },
      { pin: null, expected: "PIN cannot be empty" },
      { pin: undefined, expected: "PIN cannot be empty" },
    ];

    for (const testCase of testCases) {
      const response = await request(app)
        .post("/api/auth/setup-pin")
        .send({ email: "admin@example.com", pin: testCase.pin });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: testCase.expected });
    }
  });

  it("should return 400 if PIN is not a string", async () => {
    const response = await request(app)
      .post("/api/auth/setup-pin")
      .send({ email: "admin@example.com", pin: 123456 });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "PIN must be a string" });
  });

  it("should handle database errors", async () => {
    jest.spyOn(prisma.user, "create").mockRejectedValue(new Error("DB Error"));

    const response = await request(app)
      .post("/api/auth/setup-pin")
      .send({ email: "admin@example.com", pin: "123456" });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: "Internal server error" });

    jest.restoreAllMocks();
  });
});

describe("POST /api/auth/setup-pin (Negative Cases)", () => {
  it("should return 500 when database fails during PIN check", async () => {
    jest.spyOn(prisma.user, "count").mockRejectedValue(new Error("DB Error"));

    const response = await request(app)
      .post("/api/auth/setup-pin")
      .send({ email: "admin@example.com", pin: "123456" });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: "Internal server error" });

    jest.restoreAllMocks();
  });

  it("should return 400 when PIN contains special characters", async () => {
    const response = await request(app)
      .post("/api/auth/setup-pin")
      .send({ email: "admin@example.com", pin: "12@456" });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "PIN must contain only numbers" });
  });

  it("should return 400 when request body is malformed", async () => {
    const response = await request(app)
      .post("/api/auth/setup-pin")
      .send("invalid-json");

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
  });

  it("should return 400 when PIN is undefined", async () => {
    const response = await request(app)
      .post("/api/auth/setup-pin")
      .send({ email: "admin@example.com", pin: undefined });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "PIN cannot be empty" });
  });
});

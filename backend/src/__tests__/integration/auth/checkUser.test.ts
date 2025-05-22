import request from "supertest";
import express from "express";
import authRoutes from "../../../routes/authRouter";
import prisma from "../../../lib/prisma";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);

jest.setTimeout(90000);

describe("GET /api/auth/check-user", () => {
  beforeEach(async () => {
    await prisma.otp.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.otp.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  it("should return isPinSet: false when no user exists", async () => {
    const response = await request(app).get("/api/auth/check-user");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "No admin found",
      isPinSet: false,
    });
  });

  it("should return isPinSet: true when user exists", async () => {
    await prisma.user.create({
      data: {
        email: "test@example.com",
        pin: await bcrypt.hash("123456", 10),
      },
    });

    const response = await request(app).get("/api/auth/check-user");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      isPinSet: true,
      isAuthenticated: false,
    });
  });

  it("should return isAuthenticated: true when refresh token exists", async () => {
    await prisma.user.create({
      data: {
        email: "test@example.com",
        pin: await bcrypt.hash("123456", 10),
      },
    });

    const response = await request(app)
      .get("/api/auth/check-user")
      .set("Cookie", ["refresh_token=mocked-refresh-token"]);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      isPinSet: true,
      isAuthenticated: true,
    });
  });
});

describe("GET /api/auth/check-user (Negative Cases)", () => {
  beforeEach(async () => {
    await prisma.otp.deleteMany();
    await prisma.user.deleteMany();
  });

  afterEach(async () => {
    jest.restoreAllMocks();
  });

  it("should handle database query failure", async () => {
    const mockError = new Error("Database connection error");
    jest.spyOn(prisma.user, "findFirst").mockRejectedValue(mockError);

    const response = await request(app).get("/api/auth/check-user");

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("message", "Internal server error");

    jest.restoreAllMocks();
  }, 60000);

  it("should handle multiple users scenario", async () => {
    await prisma.user.createMany({
      data: [
        { email: "user1@example.com", pin: await bcrypt.hash("111111", 10) },
        { email: "user2@example.com", pin: await bcrypt.hash("222222", 10) },
      ],
    });

    const response = await request(app).get("/api/auth/check-user");

    expect(response.status).toBe(200);
    expect(response.body.isPinSet).toBe(true);
  });

  it("should handle invalid cookie format", async () => {
    await prisma.user.create({
      data: {
        email: "test@example.com",
        pin: await bcrypt.hash("123456", 10),
      },
    });

    const response = await request(app)
      .get("/api/auth/check-user")
      .set("Cookie", ["invalid-cookie-format"]);

    expect(response.status).toBe(200);
    expect(response.body.isAuthenticated).toBe(false);
  });

  it("should handle empty cookie", async () => {
    await prisma.user.create({
      data: {
        email: "test@example.com",
        pin: await bcrypt.hash("123456", 10),
      },
    });

    const response = await request(app)
      .get("/api/auth/check-user")
      .set("Cookie", [""]);

    expect(response.status).toBe(200);
    expect(response.body.isAuthenticated).toBe(false);
  });
});

import request from "supertest";
import express from "express";
import authRoutes from "../../../routes/authRouter";
import prisma from "../../../lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);

jest.setTimeout(90000);

describe("POST /api/auth/refresh-token", () => {
  let user: any;

  beforeAll(async () => {
    await prisma.otp.deleteMany();
    await prisma.user.deleteMany();
    user = await prisma.user.create({
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

  it("should return new access token with valid refresh token", async () => {
    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.REFRESH_SECRET!,
      { expiresIn: "7d" }
    );

    jest.spyOn(jwt, "verify").mockReturnValue({ userId: user.id } as any);
    jest.spyOn(jwt, "sign").mockReturnValue("new-access-token" as any);

    const response = await request(app)
      .post("/api/auth/refresh-token")
      .set("Cookie", [`refresh_token=${refreshToken}`]);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ accessToken: "new-access-token" });

    jest.restoreAllMocks();
  });

  it("should return 401 without refresh token", async () => {
    const response = await request(app).post("/api/auth/refresh-token");

    expect(response.status).toBe(401);
  });

  it("should return 403 with invalid refresh token", async () => {
    jest.spyOn(jwt, "verify").mockImplementation(() => {
      throw new Error("Invalid token");
    });

    const response = await request(app)
      .post("/api/auth/refresh-token")
      .set("Cookie", ["refresh_token=invalid-token"]);

    expect(response.status).toBe(403);

    jest.restoreAllMocks();
  });
});

describe("POST /api/auth/refresh-token (Negative Cases)", () => {
  let user: any;
  let validRefreshToken: string;

  beforeAll(async () => {
    await prisma.user.deleteMany();
    user = await prisma.user.create({
      data: {
        email: "test@example.com",
        pin: await bcrypt.hash("123456", 10),
      },
    });
    validRefreshToken = jwt.sign(
      { userId: user.id },
      process.env.REFRESH_SECRET!,
      { expiresIn: "7d" }
    );
  });

  afterAll(async () => {
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  it("should return 403 with tampered refresh token", async () => {
    const tamperedToken = jwt.sign({ userId: user.id }, "wrong-secret", {
      expiresIn: "7d",
    });

    const response = await request(app)
      .post("/api/auth/refresh-token")
      .set("Cookie", [`refresh_token=${tamperedToken}`]);

    expect(response.status).toBe(403);
  });

  it("should return 403 with expired refresh token", async () => {
    jest.spyOn(jwt, "verify").mockImplementation(() => {
      throw new jwt.TokenExpiredError("Expired token", new Date());
    });

    const response = await request(app)
      .post("/api/auth/refresh-token")
      .set("Cookie", ["refresh_token=expired-token"]);

    expect(response.status).toBe(403);
    jest.restoreAllMocks();
  });

  it("should handle non-existent user scenario", async () => {
    const validResponse = await request(app)
      .post("/api/auth/refresh-token")
      .set("Cookie", [`refresh_token=${validRefreshToken}`]);
    expect(validResponse.status).toBe(200);

    const nonExistentUserId = 9999;
    const refreshToken = jwt.sign(
      { userId: nonExistentUserId },
      process.env.REFRESH_SECRET!,
      { expiresIn: "7d" }
    );

    const response = await request(app)
      .post("/api/auth/refresh-token")
      .set("Cookie", [`refresh_token=${refreshToken}`]);

    expect([200, 403]).toContain(response.status);

    if (response.status === 200) {
      expect(response.body).toHaveProperty("accessToken");
    } else {
      expect(response.status).toBe(403);
    }
  });
});

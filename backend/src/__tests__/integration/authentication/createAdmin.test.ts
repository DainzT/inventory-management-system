import request from "supertest";
import express from "express";
import authRoutes from "../../../routes/authRouter";
import prisma from "../../../lib/prisma";

const app = express();
app.use(express.json());
app.use("/api/auth", authRoutes);

jest.setTimeout(90000);

describe("POST /api/auth/create-admin", () => {
  beforeEach(async () => {
    await prisma.otp.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.otp.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  it("should create a new admin with valid PIN", async () => {
    await prisma.otp.create({
      data: {
        email: "test@example.com",
        otp: "123456",
        verified: true,
        otpExpiration: new Date(Date.now() + 3600000),
      },
    });
    const response = await request(app)
      .post("/api/auth/create-admin")
      .send({ email: "test@example.com", pin: "123456" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "Admin account created successfully",
      success: true,
    });

    const user = await prisma.user.findFirst();
    expect(user).toBeTruthy();
    expect(user?.email).toBe("test@example.com");
  });
});

describe("POST /api/auth/create-admin (Negative Cases)", () => {
  it("should return 500 when database connection fails", async () => {
    jest
      .spyOn(prisma.user, "findFirst")
      .mockRejectedValue(new Error("DB Connection Error"));

    const response = await request(app)
      .post("/api/auth/create-admin")
      .send({ email: "admin@example.com", pin: "123456" });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      message: "Internal server error",
      success: false,
    });

    jest.restoreAllMocks();
  });

  it("should return 401 when request body is empty", async () => {
    const response = await request(app).post("/api/auth/create-admin").send({});

    expect(response.status).toBe(401);
    expect(response.body.message).toContain("Fill in the requirements.");
  });
});

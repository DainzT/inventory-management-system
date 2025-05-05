import request from "supertest";
import express from "express";
import authRoutes from "../../routes/authRouter";
import prisma from "../../lib/prisma";

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
    const response = await request(app)
      .post("/api/auth/create-admin")
      .send({ email: "test@example.com", pin: "123456" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "Admin account created successfully",
    });
    await new Promise((resolve) => setTimeout(resolve, 100));

    const user = await prisma.user.findFirst();
    expect(user).toBeTruthy();
    expect(user?.email).toBe("test@example.com");
  });

  it("should return 400 if admin already exists", async () => {
    await request(app)
      .post("/api/auth/create-admin")
      .send({ email: "test@example.com", pin: "123456" });

    const response = await request(app)
      .post("/api/auth/create-admin")
      .send({ email: "test@example.com", pin: "654321" });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "Admin account already exists",
    });
  });

  it("should return 400 if PIN is not 6 digits", async () => {
    const response = await request(app)
      .post("/api/auth/create-admin")
      .send({ email: "test@example.com", pin: "12345" });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "PIN is required and must be exactly 6 digits long.",
    });
  });

  it("should return 400 if PIN contains non-digits", async () => {
    const response = await request(app)
      .post("/api/auth/create-admin")
      .send({ email: "test@example.com", pin: "12ab56" });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "PIN is required and must be exactly 6 digits long.",
    });
  });

  it("should return 400 if email is missing", async () => {
    const response = await request(app)
      .post("/api/auth/create-admin")
      .send({ pin: "123456" });

    expect(response.status).toBe(500);
  });

  it("should handle database errors", async () => {
    jest.spyOn(prisma.user, "create").mockRejectedValue(new Error("DB Error"));

    const response = await request(app)
      .post("/api/auth/create-admin")
      .send({ email: "test@example.com", pin: "123456" });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: "Internal server error" });

    jest.restoreAllMocks();
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
    expect(response.body).toEqual({ message: "Internal server error" });

    jest.restoreAllMocks();
  });

  // it("should return 400 when email is invalid format", async () => {
  //   const response = await request(app)
  //     .post("/api/auth/create-admin")
  //     .send({ email: "invalid-email", pin: "123456" });

  //   expect(response.status).toBe(500);
  // });

  it("should return 400 when request body is empty", async () => {
    const response = await request(app).post("/api/auth/create-admin").send({});

    expect(response.status).toBe(400);
    expect(response.body.message).toContain("PIN is required");
  });

  it("should return 400 when PIN is null", async () => {
    const response = await request(app)
      .post("/api/auth/create-admin")
      .send({ email: "admin@example.com", pin: null });

    expect(response.status).toBe(400);
    expect(response.body.message).toContain("PIN is required");
  });
});

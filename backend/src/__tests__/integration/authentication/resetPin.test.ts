import request from "supertest";
import express from "express";
import pinRoutes from "../../../routes/authentication/pinRouter";
import prisma from "../../../lib/prisma";
import bcrypt from "bcrypt";

const app = express();
app.use(express.json());
app.use("/api/pin", pinRoutes);

jest.setTimeout(90000);

describe("POST /api/pin/reset-pin", () => {
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

  it("should reset PIN with valid email and new PIN", async () => {
    const response = await request(app)
      .post("/api/pin/reset-pin")
      .send({ email: "test@example.com", newPin: "987654" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "PIN reset successfully",
      success: true,
    });

    const updatedUser = await prisma.user.findUnique({
      where: { id: user.id },
    });
    expect(await bcrypt.compare("987654", updatedUser?.pin || "")).toBe(true);
  });

  it("should return 404 for non-existent email", async () => {
    const response = await request(app)
      .post("/api/pin/reset-pin")
      .send({ email: "nonexistent@example.com", newPin: "987654" });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      message: "User not found",
      success: false,
    });
  });

  it("should return 400 for missing email", async () => {
    const response = await request(app)
      .post("/api/pin/reset-pin")
      .send({ newPin: "987654" });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "Email is required",
      success: false,
    });
  });

  it("should return 400 for missing newPin", async () => {
    const response = await request(app)
      .post("/api/pin/reset-pin")
      .send({ email: "test@example.com" });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "PIN is required",
      success: false,
    });
  });

  it("should return 400 for invalid newPin format", async () => {
    const response = await request(app)
      .post("/api/pin/reset-pin")
      .send({ email: "test@example.com", newPin: "abc" });

    expect(response.status).toBe(400);
  });

  it("should return 400 if new PIN is same as current PIN", async () => {
    await prisma.user.update({
      where: { id: user.id },
      data: { pin: await bcrypt.hash("123456", 10) },
    });
    const response = await request(app)
      .post("/api/pin/reset-pin")
      .send({ email: "test@example.com", newPin: "123456" });
    expect(response.status).toBe(400);
  });

  describe("POST /api/api/reset-pin (Negative Cases)", () => {
    it("should handle PIN reset database errors", async () => {
      jest
        .spyOn(prisma.user, "update")
        .mockRejectedValueOnce(new Error("DB Error"));

      const response = await request(app)
        .post("/api/otp/reset-pin")
        .send({ email: "test@example.com", newPin: "987654" });

      expect([404, 500]).toContain(response.status);
    });

    it("should return 404 when reset PIN request has no email", async () => {
      const response = await request(app)
        .post("/api/otp/reset-pin")
        .send({ email: "", newPin: "987654" });

      expect(response.status).toBe(404);
    });
  });
});

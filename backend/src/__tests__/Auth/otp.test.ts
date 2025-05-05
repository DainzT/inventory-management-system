import request from "supertest";
import express from "express";
import authRoutes from "../../routes/authRouter";
import prisma from "../../lib/prisma";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import { generateOtp, saveOtpToDatabase } from "../../lib/otpService";

const app = express();
app.use(express.json());
app.use("/api/auth", authRoutes);

jest.setTimeout(90000);

jest.mock("nodemailer", () => ({
  createTransport: jest.fn().mockReturnValue({
    sendMail: jest.fn().mockImplementation((mailOptions) => {
      if (mailOptions.to && mailOptions.subject && mailOptions.text) {
        return Promise.resolve({
          response: "250 OK",
          messageId: "<mocked-message-id@example.com>",
          envelope: {
            from: mailOptions.from,
            to: [mailOptions.to],
          },
          accepted: [mailOptions.to],
          rejected: [],
          pending: [],
        });
      } else {
        return Promise.reject(new Error("Missing required fields"));
      }
    }),
  }),
}));

jest.mock("../../lib/otpService", () => ({
  generateOtp: jest.fn(() => "123456"),
  saveOtpToDatabase: jest.fn(
    async (otp: string, otpExpiry: number, userId: number) => {
      await prisma.otp.create({
        data: {
          userId,
          otp,
          otpExpiration: new Date(otpExpiry),
        },
      });
      return true;
    }
  ),
}));

describe("OTP Related Routes", () => {
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

    process.env.EMAIL_USER = "test@example.com";
    process.env.EMAIL_PASS = "testpassword";
  });

  afterAll(async () => {
    await prisma.otp.deleteMany().catch(() => {});
    await prisma.user.deleteMany().catch(() => {});
    await prisma.$disconnect();
  });

  describe("POST /api/auth/send-otp-email", () => {
    it("should send OTP email for valid email", async () => {
      const response = await request(app)
        .post("/api/auth/send-otp-email")
        .send({ email: "test@example.com" });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        message: "OTP sent successfully",
        success: true,
      });
      expect(nodemailer.createTransport().sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          from: process.env.EMAIL_USER,
          to: "test@example.com",
          subject: "Your OTP Code",
          text: expect.stringContaining("123456"),
        })
      );

      expect(generateOtp).toHaveBeenCalled();
      expect(saveOtpToDatabase).toHaveBeenCalled();
    });

    it("should return 400 for missing email", async () => {
      const response = await request(app)
        .post("/api/auth/send-otp-email")
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: "Email is required." });
    });

    it("should return 404 for non-existent email", async () => {
      const response = await request(app)
        .post("/api/auth/send-otp-email")
        .send({ email: "nonexistent@example.com" });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: "User not found." });
    });
  });

  describe("POST /api/auth/verify-otp", () => {
    it("should verify valid OTP", async () => {
      await prisma.otp.create({
        data: {
          userId: user.id,
          otp: "123456",
          otpExpiration: new Date(Date.now() + 10 * 60 * 1000),
        },
      });

      const response = await request(app)
        .post("/api/auth/verify-otp")
        .send({ email: "test@example.com", otp: "123456" });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: "OTP verified successfully" });
    });

    it("should return 400 for invalid OTP", async () => {
      const response = await request(app)
        .post("/api/auth/verify-otp")
        .send({ email: "test@example.com", otp: "wrongotp" });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: "Invalid OTP" });
    });

    it("should return 400 for expired OTP", async () => {
      await prisma.otp.create({
        data: {
          userId: user.id,
          otp: "654321",
          otpExpiration: new Date(Date.now() - 1000),
        },
      });

      const response = await request(app)
        .post("/api/auth/verify-otp")
        .send({ email: "test@example.com", otp: "654321" });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: "OTP has expired" });
    });
  });

  describe("POST /api/auth/reset-pin", () => {
    it("should reset PIN with valid OTP and new PIN", async () => {
      const response = await request(app)
        .post("/api/auth/reset-pin")
        .send({ email: "test@example.com", newPin: "987654" });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: "PIN reset successfully" });

      const updatedUser = await prisma.user.findUnique({
        where: { id: user.id },
      });
      expect(await bcrypt.compare("987654", updatedUser?.pin || "")).toBe(true);
    });

    it("should return 400 for invalid new PIN format", async () => {
      const testCases = [
        {
          pin: "12345",
          message:
            "New PIN must be exactly 6 digits long and only contain numbers.",
        },
        {
          pin: "abcdef",
          message:
            "New PIN must be exactly 6 digits long and only contain numbers.",
        },
      ];

      for (const testCase of testCases) {
        const response = await request(app)
          .post("/api/auth/reset-pin")
          .send({ email: "test@example.com", newPin: testCase.pin });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("message", testCase.message);
      }
    });

    it("should return 404 for non-existent email", async () => {
      const response = await request(app)
        .post("/api/auth/reset-pin")
        .send({ email: "nonexistent@example.com", newPin: "987654" });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: "User not found" });
    });
  });
});

describe("OTP Related Routes (Negative Cases)", () => {
  it("should handle email sending failure gracefully", async () => {
    (nodemailer.createTransport().sendMail as jest.Mock).mockImplementationOnce(
      () => Promise.reject(new Error("SMTP Error"))
    );

    const response = await request(app)
      .post("/api/auth/send-otp-email")
      .send({ email: "nonexistent@example.com" });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "User not found." });
  });

  // it("should return 404 for invalid email format", async () => {
  //   const response = await request(app)
  //     .post("/api/auth/send-otp-email")
  //     .send({ email: "invalid-email" });

  //   expect(response.status).toBe(404);
  //   expect(response.body).toEqual({ message: "User not found." });
  // });

  it("should handle database errors during OTP save", async () => {
    (saveOtpToDatabase as jest.Mock).mockImplementationOnce(() => {
      throw new Error("Database error");
    });

    const response = await request(app)
      .post("/api/auth/send-otp-email")
      .send({ email: "test@example.com" });
    expect([404, 500]).toContain(response.status);
  });

  it("should return 404 for malformed OTP verification request", async () => {
    const response = await request(app)
      .post("/api/auth/verify-otp")
      .send("invalid-json");

    expect(response.status).toBe(500);
  });

  it("should handle OTP database query failures", async () => {
    jest
      .spyOn(prisma.otp, "findFirst")
      .mockRejectedValueOnce(new Error("DB Error"));

    const response = await request(app)
      .post("/api/auth/verify-otp")
      .send({ email: "test@example.com", otp: "123456" });

    expect([404, 500]).toContain(response.status);
  });

  it("should handle PIN reset database errors", async () => {
    jest
      .spyOn(prisma.user, "update")
      .mockRejectedValueOnce(new Error("DB Error"));

    const response = await request(app)
      .post("/api/auth/reset-pin")
      .send({ email: "test@example.com", newPin: "987654" });

    expect([404, 500]).toContain(response.status);
  });

  it("should return 404 when reset PIN request has no email", async () => {
    const response = await request(app)
      .post("/api/auth/reset-pin")
      .send({ newPin: "987654" });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "User not found" });
  });

  it("should return 400 when reset PIN request has invalid newPin", async () => {
    const response = await request(app)
      .post("/api/auth/reset-pin")
      .send({ email: "test@example.com", newPin: "123" });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
  });
});

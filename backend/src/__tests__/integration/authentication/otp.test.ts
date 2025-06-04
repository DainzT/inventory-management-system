import request from "supertest";
import express from "express";
import otpRoutes from "../../../routes/authentication/otpRouter";
import pinRoutes from "../../../routes/authentication/pinRouter";
import prisma from "../../../lib/prisma";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import { generateOtp, saveOtpToDatabase } from "../../../lib/otpService";

const app = express();
app.use(express.json());
app.use("/api/otp", otpRoutes);
app.use("/api/pin", pinRoutes);

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

jest.mock("../../../lib/otpService", () => ({
  generateOtp: jest.fn(() => "123456"),
  saveOtpToDatabase: jest.fn().mockResolvedValue(true), // Simplified mock
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
    jest.clearAllMocks();
    jest.restoreAllMocks();
    await prisma.otp.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  describe("POST /api/otp/send-otp-email", () => {
    it("should send OTP email for valid email", async () => {
      const sendMailMock = nodemailer.createTransport().sendMail as jest.Mock;
      sendMailMock.mockClear().mockResolvedValueOnce({
        response: "250 OK",
        messageId: "test-message-id",
      });

      const testEmail = `test-${Date.now()}@example.com`;

      await prisma.user.create({
        data: {
          email: testEmail,
          pin: await bcrypt.hash("123456", 10),
        },
      });

      const response = await request(app).post("/api/otp/send-otp-email").send({
        email: testEmail,
        pin: "123456",
        confirmPin: "123456",
      });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        message: "OTP sent successfully",
        success: true,
      });

      expect(generateOtp).toHaveBeenCalled();
      expect(saveOtpToDatabase).toHaveBeenCalled();
      expect(sendMailMock).toHaveBeenCalledWith({
        from: process.env.EMAIL_USER,
        to: testEmail,
        subject: "Your OTP Code",
        text: expect.stringContaining("123456"),
      });
    });

    it("should return 400 for missing email", async () => {
      const response = await request(app)
        .post("/api/otp/send-otp-email")
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: "Fill in the requirements." });
    });
  });

  describe("POST /api/otp/verify-otp", () => {
    it("should verify valid OTP", async () => {
      await prisma.otp.create({
        data: {
          email: "test@gmail.com",
          otp: "123456",
          otpExpiration: new Date(Date.now() + 10 * 60 * 1000),
        },
      });

      const response = await request(app)
        .post("/api/otp/verify-otp")
        .send({ email: "test@example.com", otp: "123456" });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        message: "OTP verified successfully",
        success: true,
      });
    });

    it("should return 400 for invalid OTP", async () => {
      const response = await request(app)
        .post("/api/otp/verify-otp")
        .send({ email: "test@example.com", otp: "wrongotp" });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: "Invalid OTP" });
    });

    it("should return 400 for expired OTP", async () => {
      await prisma.otp.create({
        data: {
          email: "test@gmail.com",
          otp: "654321",
          otpExpiration: new Date(Date.now() - 1000),
        },
      });

      const response = await request(app)
        .post("/api/otp/verify-otp")
        .send({ email: "test@example.com", otp: "654321" });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: "OTP has expired" });
    });
  });

  describe("OTP Related Routes (Negative Cases)", () => {
    it("should handle email sending failure gracefully", async () => {
      const sendMailMock = nodemailer.createTransport().sendMail as jest.Mock;
      sendMailMock.mockRejectedValueOnce(new Error("SMTP Error"));
      const response = await request(app).post("/api/otp/send-otp-email").send({
        email: "test@example.com",
        pin: "123456",
        confirmPin: "123456",
      });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        message: "Failed to send OTP",
        success: false,
        error: {
          message: "SMTP Error",
        },
      });
    });

    it("should handle database errors during OTP save", async () => {
      const uniqueEmail = `test-${Date.now()}@example.com`;

      await prisma.user.create({
        data: {
          email: uniqueEmail,
          pin: await bcrypt.hash("123456", 10),
        },
      });
      (saveOtpToDatabase as jest.Mock).mockImplementationOnce(() => {
        throw new Error("Database error");
      });

      const response = await request(app).post("/api/otp/send-otp-email").send({
        email: "test@example.com",
        pin: "123456",
        confirmPin: "123456",
      });

      expect(response.status).toBe(500);
    });

    it("should return 400 for malformed OTP verification request", async () => {
      const response = await request(app)
        .post("/api/otp/verify-otp")
        .send("invalid-json");

      expect(response.status).toBe(400);
    });

    it("should handle OTP database query failures", async () => {
      jest
        .spyOn(prisma.otp, "findFirst")
        .mockRejectedValueOnce(new Error("DB Error"));

      const response = await request(app)
        .post("/api/otp/verify-otp")
        .send({ email: "test@example.com", otp: "123456" });

      expect([404, 500]).toContain(response.status);
    });
  });
});

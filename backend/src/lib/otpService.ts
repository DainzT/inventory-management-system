import prisma from "./prisma";

export const generateOtp = (): string => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  return otp.toString();
};

export const saveOtpToDatabase = async (
  email: string,
  otp: string,
  otpExpiry: number
) => {
  try {
    await prisma.otp.create({
      data: {
        email,
        otp,
        otpExpiration: new Date(otpExpiry),
      },
    });
  } catch (error) {
    console.error("Error saving OTP to database:", error);
    throw error;
  }
};

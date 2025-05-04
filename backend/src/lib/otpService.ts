import prisma from "./prisma";

export const generateOtp = (): string => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  return otp.toString();
};

export const saveOtpToDatabase = async (
  otp: string,
  otpExpiry: number,
  userId: number
) => {
  try {
    await prisma.otp.create({
      data: {
        otp,
        otpExpiration: new Date(otpExpiry),
        userId,
      },
    });
  } catch (error) {
    console.error("Error saving OTP to database:", error);
    throw error;
  }
};

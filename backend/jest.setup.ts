import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

module.exports = async function globalSetup() {
  try {
    await prisma.otp.deleteMany();
    await prisma.user.deleteMany();
  } catch (error) {
    console.error("Global setup error:", error);
    process.exit(1);
  }
};

module.exports.teardown = async function globalTeardown() {
  await prisma.$disconnect();
};

export async function clearDatabase() {
  await prisma.otp.deleteMany();
  await prisma.user.deleteMany();
}

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.product.create({
    data: {
      name: 'Sample Product',
      description: 'This is a sample product.',
      quantity: 10,
    },
  });
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
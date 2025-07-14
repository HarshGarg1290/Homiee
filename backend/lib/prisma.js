import { PrismaClient } from '@prisma/client';const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  log: ['error', 'warn'],
});
// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});
export default prisma;
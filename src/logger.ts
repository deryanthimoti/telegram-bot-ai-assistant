import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function logCommand(userId: string, username: string, command: string) {
  await prisma.log.create({
    data: {
      userId,
      username,
      command,
    }
  });
}

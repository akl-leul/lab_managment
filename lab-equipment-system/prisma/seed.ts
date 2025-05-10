import { PrismaClient, Role } from '@prisma/client';
import bcrypt = require('bcryptjs');  // CommonJS import style

const prisma = new PrismaClient();

async function main() {
  const plainPassword = '123456';
  const passwordHash = await bcrypt.hash(plainPassword, 10);

  const users = [
    { username: 'adminBoss', role: Role.SUPER_ADMIN },
    { username: 'admin1', role: Role.ADMIN },
    { username: 'admin2', role: Role.ADMIN },
  ];

  for (const userData of users) {
    const existingUser = await prisma.user.findUnique({
      where: { username: userData.username },
    });

    if (!existingUser) {
      await prisma.user.create({
        data: {
          username: userData.username,
          password: passwordHash,
          role: userData.role,
        },
      });
      console.log(`Created user: ${userData.username} with password: ${plainPassword}`);
    } else {
      console.log(`User already exists: ${userData.username}`);
    }
  }
}

main()
  .catch((e) => {
    console.error('Error seeding users:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

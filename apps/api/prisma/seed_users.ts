import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function seedUsers() {
  const hashedPassword1 = await bcrypt.hash('password123', 10);
  const hashedPassword2 = await bcrypt.hash('securepass', 10);
  const hashedPassword3 = await bcrypt.hash('mysecret', 10);

  const usersToSeed = [
    {
      email: 'alice@example.com',
      name: 'Alice Smith',
      password: hashedPassword1,
    },
    {
      email: 'bob@example.com',
      name: 'Bob Johnson',
      password: hashedPassword2,
    },
    {
      email: 'charlie@example.com',
      name: 'Charlie Brown',
      password: hashedPassword3,
    },
  ];

  await prisma.user.createMany({ data: usersToSeed, skipDuplicates: true });
  console.log('Users seeded successfully (or skipped if already present)!');
}

seedUsers();

import { PrismaClient } from '../generated/prisma';
import { randomUUID } from 'node:crypto';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  const options = {
    type: argon2.argon2id,
    // memoryCost: 16384,
    memoryCost: 32768,
    timeCost: 3,
    parallelism: 1,
  };

  const password1 = await argon2.hash('password1', options);
  const password2 = await argon2.hash('password2', options);

  await prisma.user.createMany({
    data: [
      {
        name: 'John Doe',
        userName: 'johndoe',
        password: password1,
        email: 'john@example.com',
        emailVerified: false,
        image: null,
      },
      {
        id: randomUUID(),
        name: 'Jane Smith',
        userName: 'janesmith',
        password: password2,
        email: 'jane@example.com',
        emailVerified: false,
        image: null,
      },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

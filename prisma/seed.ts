import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create admin user
  const adminEmail = 'eunus527@gmail.com';
  const adminPassword = 'RAna22@@';

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(adminPassword, salt);

    const admin = await prisma.user.create({
      data: {
        email: adminEmail,
        passwordHash,
        zaxoNumber: '482-719-356',
        displayName: 'Eunus',
        phoneNumber: '+1-555-0101',
        bio: 'Managing Zaxo Messenger',
        status: 'Available',
        isOnline: false,
        role: 'admin',
      },
    });

    console.log(`Admin user created: ${admin.email} (${admin.zaxoNumber})`);
  } else {
    console.log('Admin user already exists, skipping...');
  }

  // Create some Zaxo number pool entries
  const existingPool = await prisma.zaxoNumberPool.count();
  if (existingPool === 0) {
    const numbers = [];
    for (let i = 0; i < 100; i++) {
      const part1 = Math.floor(Math.random() * 900 + 100);
      const part2 = Math.floor(Math.random() * 900 + 100);
      const part3 = Math.floor(Math.random() * 900 + 100);
      numbers.push({
        number: `${part1}-${part2}-${part3}`,
        status: 'available',
        isPremium: i < 10,
      });
    }
    await prisma.zaxoNumberPool.createMany({ data: numbers });
    console.log('Created 100 Zaxo numbers in pool');
  }

  console.log('Seed completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

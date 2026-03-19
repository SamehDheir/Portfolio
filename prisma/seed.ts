// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

// تحميل متغيرات البيئة عشان يقرأ الـ DATABASE_URL
dotenv.config();

async function main() {
  // 1. تجهيز الاتصال يدوياً (مهم جداً لـ Prisma 7)
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool as any);
  
  // 2. تمرير الـ adapter للـ Client
  const prisma = new PrismaClient({ adapter });

  console.log('--- Seed started ---');

  const password = 'sameh2134$'; // غيرها لشيء خاص فيك
  const hashedPassword = await bcrypt.hash(password, 10);

  // إنشاء مستخدم "سامح"
  const admin = await prisma.user.upsert({
    where: { email: 'sameh.dheir1@gmail.com' }, // حط إيميلك هون
    update: {},
    create: {
      email: 'sameh.dheir1@gmail.com',
      name: 'Sameh Dheir',
      password: hashedPassword,
    },
  });

  console.log('✅ Admin account created:', admin.email);

  await prisma.$disconnect();
  await pool.end(); // إغلاق الـ pool كمان
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  });
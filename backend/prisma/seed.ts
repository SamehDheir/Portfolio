import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config();

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool as any);

  const prisma = new PrismaClient({ adapter });

  console.log('--- Seed started ---');

  const ADMIN_ID = 'c0a80101-d6sd-2343-sdfd-2g3gsk3hgd81';
  const password = 'sameh2134$';
  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await prisma.user.upsert({
    where: { id: ADMIN_ID },
    update: {
      email: 'sameh.dheir1@gmail.com',
    },
    create: {
      id: ADMIN_ID,
      email: 'sameh.dheir1@gmail.com',
      name: 'Sameh Dheir',
      password: hashedPassword,
    },
  });

  console.log('✅ Admin account created:', admin.email);

  await prisma.$disconnect();
  await pool.end();
}

main().catch((e) => {
  console.error('❌ Seed error:', e);
  process.exit(1);
});

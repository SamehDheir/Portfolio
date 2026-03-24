// src/prisma/prisma.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import * as Prisma from '@prisma/client'; 
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService extends Prisma.PrismaClient implements OnModuleInit {
  constructor() {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const adapter = new PrismaPg(pool as any);
    
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }
}
// src/prisma/prisma.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import * as Prisma from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService extends Prisma.PrismaClient implements OnModuleInit {
  constructor() {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 20, // Maximum number of connections in the pool
      idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
      connectionTimeoutMillis: 60000, // Wait up to 60 seconds to acquire a connection
    });
    const adapter = new PrismaPg(pool as any);

    super({
      adapter,
      log: [
        { emit: 'stdout', level: 'error' },
        { emit: 'stdout', level: 'warn' },
      ],
    });
  }

  async onModuleInit() {
    await this.$connect();
  }
}

import { Module } from '@nestjs/common';
import { LinkedinService } from './linkedin.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [LinkedinService],
  exports: [LinkedinService],
})
export class LinkedinModule {}

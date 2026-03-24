import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSkillDto } from './dto/create-skill.dto';

@Injectable()
export class SkillsService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateSkillDto, userId: string) {
    return this.prisma.skill.create({
      data: { ...data, author: { connect: { id: userId } } },
    });
  }

  async findAll() {
    return this.prisma.skill.findMany({ orderBy: { level: 'desc' } });
  }

  async findOne(id: string) {
    const skill = await this.prisma.skill.findUnique({ where: { id } });
    if (!skill) throw new NotFoundException('Skill not found');
    return skill;
  }

  async update(id: string, data: Partial<CreateSkillDto>) {
    return this.prisma.skill.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.skill.delete({ where: { id } });
  }
}

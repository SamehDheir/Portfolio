import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import * as fs from 'fs';
import { join } from 'path';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  private deleteFiles(filePaths: string[]) {
  filePaths.forEach((path) => {
    const cleanedPath = path.startsWith('/') ? path.substring(1) : path;

    const fullPath = join(process.cwd(), cleanedPath);

    console.log(`Attempting to delete: ${fullPath}`);

    if (fs.existsSync(fullPath)) {
      try {
        fs.unlinkSync(fullPath);
        console.log(`Successfully deleted: ${fullPath}`);
      } catch (err) {
        console.error(`Error deleting file: ${fullPath}`, err);
      }
    } else {
      console.warn(`File not found at: ${fullPath}`);
    }
  });
}

  async create(createProjectDto: CreateProjectDto, userId: string) {
    return this.prisma.project.create({
      data: {
        ...createProjectDto,
        author: {
          connect: { id: userId },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.project.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const project = await this.prisma.project.findUnique({ where: { id } });
    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  async update(id: string, updateData: any) {
    const oldProject = await this.prisma.project.findUnique({ where: { id } });

    if (!oldProject) {
      throw new NotFoundException('Project not found');
    }
    if (updateData.images && oldProject.images.length > 0) {
      this.deleteFiles(oldProject.images);
    }
    return this.prisma.project.update({
      where: { id },
      data: {
        ...updateData,
      },
    });
  }

  async remove(id: string) {
    const project = await this.findOne(id);

    if (project.images.length > 0) {
      this.deleteFiles(project.images);
    }

    return this.prisma.project.delete({ where: { id } });
  }
}

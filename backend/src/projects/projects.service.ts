import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService,
  ) {}

  private async deleteCloudinaryFiles(urls: string[]) {
    const deletePromises = urls
      .filter((url) => url && url.includes('cloudinary'))
      .map((url) => {
        try {
          const parts = url.split('upload/');
          if (parts.length < 2) return Promise.resolve();

          const pathWithVersion = parts[1];
          const segments = pathWithVersion.split('/');

          const publicIdWithExt = segments.slice(1).join('/');

          const publicId = publicIdWithExt.split('.')[0];

          return this.cloudinary.deleteFile(publicId);
        } catch (error) {
          return Promise.resolve();
        }
      });

    await Promise.all(deletePromises);
  }

  async create(
    data: CreateProjectDto,
    files: Express.Multer.File[],
    userId: string,
  ) {
    let imageUrls: string[] = [];

    if (files && files.length > 0) {
      const uploadPromises = files.map((file) =>
        this.cloudinary.uploadFile(file, 'portfolio/projects'),
      );
      const results = await Promise.all(uploadPromises);
      imageUrls = results.map((res) => res.secure_url);
    }

    return this.prisma.project.create({
      data: {
        ...data,
        images: imageUrls,
        author: { connect: { id: userId } },
      },
    });
  }

  async findAll(limit?: number) {
    return this.prisma.project.findMany({
      take: limit ? Number(limit) : undefined,
      orderBy: { createdAt: 'desc' },
      include: { author: { select: { name: true, title: true } } },
    });
  }

  async findOne(id: string) {
    const project = await this.prisma.project.findUnique({ where: { id } });
    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  async update(
    id: string,
    updateData: UpdateProjectDto,
    files?: Express.Multer.File[],
  ) {
    const oldProject = await this.findOne(id);
    let imageUrls = oldProject.images;

    if (files && files.length > 0) {
      if (oldProject.images && oldProject.images.length > 0) {
        await this.deleteCloudinaryFiles(oldProject.images);
      }

      const uploadPromises = files.map((file) =>
        this.cloudinary.uploadFile(file, 'portfolio/projects'),
      );
      const results = await Promise.all(uploadPromises);
      imageUrls = results.map((res) => res.secure_url);
    }

    const { images, ...dataToUpdate } = updateData;

    return this.prisma.project.update({
      where: { id },
      data: {
        ...dataToUpdate,
        images: imageUrls,
      },
    });
  }

  async remove(id: string) {
    const project = await this.findOne(id);

    const deletedProject = await this.prisma.project.delete({ where: { id } });

    if (project.images && project.images.length > 0) {
      await this.deleteCloudinaryFiles(project.images);
    }

    return deletedProject;
  }
}

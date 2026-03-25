import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreatePostDto, userId: string) {
    const slug = data.title
      .toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '');

    return this.prisma.post.create({
      data: { ...data, slug, author: { connect: { id: userId } } },
    });
  }

  async findAll(search?: string) {
    return this.prisma.post.findMany({
      where: search
        ? {
            OR: [
              { title: { contains: search, mode: 'insensitive' } },
              { content: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {},
      orderBy: { createdAt: 'desc' },
    });
  }

  async findBySlug(slug: string) {
    const post = await this.prisma.post.findUnique({ where: { slug } });
    if (!post) throw new NotFoundException('The article does not exist');
    return post;
  }

  async update(id: string, updateData: UpdatePostDto) {
    if (updateData.title) {
      updateData.slug = updateData.title
        .toLowerCase()
        .replace(/ /g, '-')
        .replace(/[^\w-]+/g, '');
    }

    return this.prisma.post.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: string) {
    return this.prisma.post.delete({ where: { id } });
  }
}

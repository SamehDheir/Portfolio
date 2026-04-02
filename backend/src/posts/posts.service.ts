import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import slugify from 'slugify';
import { join } from 'path';
import { unlink } from 'fs/promises';
import { existsSync } from 'fs';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  private async generateUniqueSlug(title: string): Promise<string> {
    const baseSlug = slugify(title, { lower: true, strict: true });
    let slug = baseSlug;
    let counter = 1;

    while (await this.prisma.post.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    return slug;
  }

  async create(data: CreatePostDto, userId: string) {
    const slug = await this.generateUniqueSlug(data.title);

    return this.prisma.post.create({
      data: {
        title: data.title,
        content: data.content,
        category: data.category,
        tags: data.tags || [],
        published: data.published ?? false,
        coverImage: data.coverImage,
        slug,
        author: { connect: { id: userId } },
      },
    });
  }

  async findAll(query: {
    search?: string;
    category?: string;
    page?: number;
    limit?: number;
    publishedOnly?: any;
  }) {
    const { search, category, page = 1, limit = 10, publishedOnly } = query;

    const take = Number(limit);
    const skip = (Number(page) - 1) * take;
    const andConditions: any[] = [];

    const isDashboardRequest = String(publishedOnly) === 'false';

    if (!isDashboardRequest) {
      andConditions.push({ published: true });
      console.log('--- MODE: HOME (Published Only) ---');
    } else {
      console.log('--- MODE: DASHBOARD (Show All) ---');
    }

    if (category) andConditions.push({ category });
    if (search) {
      andConditions.push({
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { content: { contains: search, mode: 'insensitive' } },
        ],
      });
    }

    const where = andConditions.length > 0 ? { AND: andConditions } : {};
    console.log('FINAL PRISMA QUERY:', JSON.stringify(where, null, 2));

    const [data, total] = await Promise.all([
      this.prisma.post.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.post.count({ where }),
    ]);

    return {
      data,
      meta: { total, page: Number(page), lastPage: Math.ceil(total / take) },
    };
  }

  async getStats() {
    const [total, published, drafts] = await Promise.all([
      this.prisma.post.count(),
      this.prisma.post.count({ where: { published: true } }),
      this.prisma.post.count({ where: { published: false } }),
    ]);

    return {
      total,
      published,
      drafts,
    };
  }

  async findBySlug(slug: string) {
    const post = await this.prisma.post.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            title: true,
            profileImage: true,
          },
        },
      },
    });
    if (!post) throw new NotFoundException('The article does not exist');
    return post;
  }

  async update(id: string, updateData: UpdatePostDto) {
    const existingPost = await this.prisma.post.findUnique({ where: { id } });
    if (!existingPost) throw new NotFoundException('Post not found');

    console.log('--- Update Debug Start ---');

    if (
      updateData.coverImage &&
      updateData.coverImage.startsWith('/uploads/')
    ) {
      updateData.coverImage = updateData.coverImage.replace('/uploads/', '');
    }

    console.log('Cleaned Incoming Image:', updateData.coverImage);
    console.log('Existing Image in DB:', existingPost.coverImage);

    if (updateData.coverImage && existingPost.coverImage) {
      if (updateData.coverImage !== existingPost.coverImage) {
        const fileName = existingPost.coverImage.replace('/uploads/', '');
        const fullPath = join(process.cwd(), 'uploads', fileName);

        console.log('🚀 Attempting to delete:', fullPath);

        if (existsSync(fullPath)) {
          try {
            await unlink(fullPath);
            console.log('✅ Old image purged from storage');
          } catch (err) {
            console.error('❌ Unlink failed:', err.message);
          }
        } else {
          console.warn('⚠️ File not found on disk at:', fullPath);
        }
      }
    }

    if (updateData.title && updateData.title !== existingPost.title) {
      updateData.slug = await this.generateUniqueSlug(updateData.title);
    }

    return this.prisma.post.update({
      where: { id },
      data: {
        ...updateData,
        tags: updateData.tags || existingPost.tags,
      },
    });
  }
  async remove(id: string) {
    try {
      return await this.prisma.post.delete({ where: { id } });
    } catch (error) {
      throw new NotFoundException('Post not found or already deleted');
    }
  }
}

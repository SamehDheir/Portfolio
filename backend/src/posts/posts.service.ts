import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import slugify from 'slugify';

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
    publishedOnly?: boolean;
  }) {
    const {
      search,
      category,
      page = 1,
      limit = 10,
      publishedOnly = true,
    } = query;

    const skip = (page - 1) * limit;

    const where: any = {
      AND: [
        publishedOnly ? { published: true } : {},
        category ? { category: category as any } : {},
        search
          ? {
              OR: [
                { title: { contains: search, mode: 'insensitive' } },
                { content: { contains: search, mode: 'insensitive' } },
                { tags: { hasSome: [search] } },
              ],
            }
          : {},
      ],
    };

    const [data, total] = await Promise.all([
      this.prisma.post.findMany({
        where,
        skip,
        take: limit,
        include: {
          author: {
            select: { name: true, profileImage: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.post.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
        limit,
      },
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

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import slugify from 'slugify';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class PostsService {
  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService,
  ) {}

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

  async create(data: CreatePostDto, file: Express.Multer.File, userId: string) {
    const slug = await this.generateUniqueSlug(data.title);
    let coverImageUrl = data.coverImage;

    if (file) {
      const uploadRes = await this.cloudinary.uploadFile(file);
      coverImageUrl = uploadRes.secure_url;
    }

    return this.prisma.post.create({
      data: {
        ...data,
        coverImage: coverImageUrl,
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

  async update(
    id: string,
    updateData: UpdatePostDto,
    file?: Express.Multer.File,
  ) {
    const existingPost = await this.prisma.post.findUnique({ where: { id } });
    if (!existingPost) throw new NotFoundException('Post not found');

    let coverImageUrl = existingPost.coverImage;

    if (file) {
      const uploadRes = await this.cloudinary.uploadFile(file);
      coverImageUrl = uploadRes.secure_url;
    }

    if (updateData.title && updateData.title !== existingPost.title) {
      updateData.slug = await this.generateUniqueSlug(updateData.title);
    }

    if (file) {
      if (
        existingPost.coverImage &&
        existingPost.coverImage.includes('cloudinary')
      ) {
        await this.cloudinary.deleteFile(existingPost.coverImage);
      }

      const uploadRes = await this.cloudinary.uploadFile(file);
      coverImageUrl = uploadRes.secure_url;
    }

    return this.prisma.post.update({
      where: { id },
      data: {
        ...updateData,
        coverImage: coverImageUrl,
        tags: updateData.tags || existingPost.tags,
      },
    });
  }

  async remove(id: string) {
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (!post) throw new NotFoundException('Post not found');

    if (post.coverImage && post.coverImage.includes('cloudinary')) {
      try {
        await this.cloudinary.deleteFile(post.coverImage);
        console.log('✅ Image deleted from Cloudinary');
      } catch (err) {
        console.error(
          '❌ Failed to delete image from Cloudinary:',
          err.message,
        );
      }
    }

    return await this.prisma.post.delete({ where: { id } });
  }
}

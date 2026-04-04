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

  private async deleteCloudinaryFile(url: string) {
    if (!url || !url.includes('cloudinary')) return;
    try {
      const parts = url.split('upload/');
      if (parts.length < 2) return;

      const pathSegments = parts[1].split('/');
      const publicIdWithExt = pathSegments.slice(1).join('/');
      const publicId = publicIdWithExt.split('.')[0];

      await this.cloudinary.deleteFile(publicId);
      console.log(`✅ Deleted from Cloudinary: ${publicId}`);
    } catch (err) {
      console.error('❌ Cloudinary delete error:', err.message);
    }
  }

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
      // رفع الصورة لمجلد blog لترتيب الملفات
      const uploadRes = await this.cloudinary.uploadFile(
        file,
        'portfolio/blog',
      );
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

    const [data, total] = await Promise.all([
      this.prisma.post.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: { author: { select: { name: true } } },
      }),
      this.prisma.post.count({ where }),
    ]);

    return {
      data,
      meta: { total, page: Number(page), lastPage: Math.ceil(total / take) },
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
      if (existingPost.coverImage) {
        await this.deleteCloudinaryFile(existingPost.coverImage);
      }

      const uploadRes = await this.cloudinary.uploadFile(
        file,
        'portfolio/blog',
      );
      coverImageUrl = uploadRes.secure_url;
    }

    let newSlug = existingPost.slug;
    if (updateData.title && updateData.title !== existingPost.title) {
      newSlug = await this.generateUniqueSlug(updateData.title);
    }

    return this.prisma.post.update({
      where: { id },
      data: {
        ...updateData,
        coverImage: coverImageUrl,
        slug: newSlug,
        tags: updateData.tags || existingPost.tags,
      },
    });
  }

  async remove(id: string) {
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (!post) throw new NotFoundException('Post not found');

    if (post.coverImage) {
      await this.deleteCloudinaryFile(post.coverImage);
    }

    return await this.prisma.post.delete({ where: { id } });
  }

  async getStats() {
    const [total, published, drafts] = await Promise.all([
      this.prisma.post.count(),
      this.prisma.post.count({ where: { published: true } }),
      this.prisma.post.count({ where: { published: false } }),
    ]);

    return { total, published, drafts };
  }
}

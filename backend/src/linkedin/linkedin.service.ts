import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LinkedinWebhookDto } from './dto/linkedin-webhook.dto';
import { Category } from '@prisma/client';
import slugify from 'slugify';

@Injectable()
export class LinkedinService {
  private readonly logger = new Logger(LinkedinService.name);

  constructor(private prisma: PrismaService) {}

  async processLinkedinPost(webhookData: LinkedinWebhookDto, userId: string) {
    try {
      this.logger.log(`Processing LinkedIn post: ${webhookData.articleTitle}`);

      const existingPost = await this.prisma.post.findFirst({
        where: { linkedinPostId: webhookData.linkedinPostId },
      });

      if (existingPost) {
        this.logger.warn(
          `Post with LinkedIn ID ${webhookData.linkedinPostId} already exists`,
        );
        throw new BadRequestException('This post already exists');
      }

      const slug = await this.generateUniqueSlug(webhookData.articleTitle);

      let category: Category = Category.Others;
      if (
        webhookData.category &&
        Object.values(Category).includes(webhookData.category as Category)
      ) {
        category = webhookData.category as Category;
      }

      const post = await this.prisma.post.create({
        data: {
          title: webhookData.articleTitle,
          slug,
          content: webhookData.articleContent || webhookData.articleTitle,
          category,
          tags: webhookData.tags || [],
          published: true,
          linkedinPostId: webhookData.linkedinPostId,
          linkedinUrl: webhookData.linkedinUrl,
          linkedinPicture: webhookData.linkedinPicture,
          author: { connect: { id: userId } },
        },
      });

      this.logger.log(`✅ Successfully created post from LinkedIn: ${post.id}`);
      return post;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to process LinkedIn post: ${errorMessage}`);
      throw error;
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

  async deleteLinkedinPost(linkedinPostId: string) {
    const post = await this.prisma.post.findFirst({
      where: { linkedinPostId },
    });

    if (!post) {
      throw new BadRequestException('Post not found');
    }

    return this.prisma.post.delete({
      where: { id: post.id },
    });
  }
}

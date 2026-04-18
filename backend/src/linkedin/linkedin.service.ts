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
      const existingPost = await this.prisma.post.findFirst({
        where: { linkedinPostId: webhookData.linkedinPostId },
      });

      if (existingPost)
        throw new BadRequestException('This post already exists');

      const slug = await this.generateUniqueSlug(webhookData.articleTitle);

      const finalContent = webhookData.articleContent
        ? `## ${webhookData.articleTitle}\n\n${webhookData.articleContent}`
        : webhookData.articleTitle;

      const post = await this.prisma.post.create({
        data: {
          slug,
          content: finalContent,
          category: (webhookData.category as Category) || Category.Others,
          tags: webhookData.tags || [],
          published: true,
          linkedinPostId: webhookData.linkedinPostId,
          linkedinUrl: webhookData.linkedinUrl,
          linkedinPicture: webhookData.linkedinPicture,
          author: { connect: { id: userId } },
        },
      });
      return post;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to process LinkedIn post: ${errorMessage}`);
      throw error;
    }
  }

  private async generateUniqueSlug(text: string): Promise<string> {
    const baseSlug = slugify(text.substring(0, 50), {
      lower: true,
      strict: true,
    });
    let slug = baseSlug || `post-${Date.now()}`;
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

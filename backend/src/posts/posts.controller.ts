import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  HttpCode,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Express } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreatePostDto } from './dto/create-post.dto';
import { PostsService } from './posts.service';
import { UpdatePostDto } from './dto/update-post.dto';
import {
  ApiBearerAuth,
  ApiTags,
  ApiConsumes,
  ApiOperation,
} from '@nestjs/swagger';
import { PostQueryDto } from './dto/post-query.dto';
import { LinkedinService } from 'src/linkedin/linkedin.service';
import { LinkedinWebhookDto } from 'src/linkedin/dto/linkedin-webhook.dto';

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly linkedinService: LinkedinService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all posts with pagination and filters' })
  async findAll(@Query() query: PostQueryDto) {
    return this.postsService.findAll(query);
  }

  @Get('stats')
  async getStats() {
    return this.postsService.getStats();
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get a single post by slug' })
  async findOne(@Param('slug') slug: string) {
    return this.postsService.findBySlug(slug);
  }

  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('coverImage'))
  async create(
    @Body() createPostDto: CreatePostDto,
    @Req() req: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const isPublished = String(createPostDto.published) === 'true';

    return this.postsService.create(
      { ...createPostDto, published: isPublished },
      file,
      req.user.userId,
    );
  }

  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('coverImage'))
  async update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const isPublished =
      updatePostDto.published !== undefined
        ? String(updatePostDto.published) === 'true'
        : undefined;

    return this.postsService.update(
      id,
      { ...updatePostDto, published: isPublished },
      file,
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(id);
  }

  @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  @Post('webhook/linkedin')
  @HttpCode(201)
  @ApiOperation({
    summary: 'Webhook endpoint for LinkedIn posts',
    description:
      'Automatically syncs LinkedIn posts to your portfolio. Send this endpoint your LinkedIn post data.',
  })
  async syncLinkedinPost(
    @Body() linkedinData: LinkedinWebhookDto,
    @Req() req: any,
  ) {
    return this.linkedinService.processLinkedinPost(
      linkedinData,
      req.user.userId,
    );
  }

  @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  @Delete('webhook/linkedin/:linkedinPostId')
  @ApiOperation({
    summary: 'Delete a LinkedIn synced post',
    description: 'Remove a post that was synced from LinkedIn',
  })
  async deleteLinkedinPost(@Param('linkedinPostId') linkedinPostId: string) {
    return this.linkedinService.deleteLinkedinPost(linkedinPostId);
  }
}

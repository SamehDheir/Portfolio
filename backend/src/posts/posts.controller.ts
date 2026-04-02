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
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreatePostDto } from './dto/create-post.dto';
import { PostsService } from './posts.service';
import { UpdatePostDto } from './dto/update-post.dto';
import {
  ApiBearerAuth,
  ApiTags,
  ApiConsumes,
  ApiQuery,
  ApiOperation,
} from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { PostQueryDto } from './dto/post-query.dto';

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

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
  @UseInterceptors(
    FileInterceptor('coverImage', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(
            null,
            `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`,
          );
        },
      }),
    }),
  )
  create(
    @Body() createPostDto: CreatePostDto,
    @Req() req: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const isPublished = String(createPostDto.published) === 'true';
    const coverImage = file ? `/uploads/${file.filename}` : undefined;

    return this.postsService.create(
      { ...createPostDto, coverImage, published: isPublished },
      req.user.userId,
    );
  }

  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('coverImage', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(
            null,
            `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`,
          );
        },
      }),
    }),
  )
  async update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const isPublished =
      updatePostDto.published !== undefined
        ? String(updatePostDto.published) === 'true'
        : undefined;

    const coverImage = file ? `/uploads/${file.filename}` : undefined;

    const { title, content, category, slug } = updatePostDto;

    return this.postsService.update(id, {
      title,
      content,
      category,
      slug,
      coverImage,
      published: isPublished,
    });
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(id);
  }
}

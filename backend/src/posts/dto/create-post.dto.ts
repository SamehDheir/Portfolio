import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreatePostDto {
  @ApiProperty({
    example: 'Mastering NestJS Microservices',
    description: 'The catchy title for your blog post',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example:
      'In this post, we will explore how to build scalable microservices...',
    description: 'The main body of the post (supports Markdown text)',
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    example: 'mastering-nestjs-microservices',
    description:
      'URL-friendly version of the title (generated automatically if not provided)',
    required: false,
  })
  @IsOptional()
  slug?: string;

  @ApiProperty({
    example: 'https://your-storage.com/images/nest-cover.jpg',
    description: 'Main cover image URL for the post',
    required: false,
  })
  @IsString()
  @IsOptional()
  coverImg?: string;

  @ApiProperty({ example: 'Backend', description: 'Post category' })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({
    example: true,
    description: 'Status of the post (true for public, false for draft)',
    default: false,
    required: false,
  })
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsOptional()
  published?: boolean;
}

import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsEnum,
  IsArray,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { Category } from '@prisma/client';

export class CreatePostDto {
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
    required: false,
  })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiProperty({
    example: 'https://your-storage.com/images/nest-cover.jpg',
    required: false,
  })
  @IsString()
  @IsOptional()
  coverImage?: string;

  @ApiProperty({
    enum: Category,
    example: 'Backend',
  })
  @IsEnum(Category, {
    message: 'Category must be: Backend, Frontend, AI, DevOps, or Others',
  })
  @IsNotEmpty()
  category: Category;

  @ApiProperty({
    example: ['NestJS', 'Microservices', 'Prisma'],
    description: 'Array of tags for the post',
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') return value.split(',').map((t) => t.trim());
    return value;
  })
  tags?: string[];

  @ApiProperty({
    example: true,
    default: false,
    required: false,
  })
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsOptional()
  published?: boolean;
}

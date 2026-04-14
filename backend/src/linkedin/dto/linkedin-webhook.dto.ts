import { IsString, IsOptional, IsArray, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LinkedinWebhookDto {
  @ApiProperty({
    example: 'urn:li:activity:123456789',
    description: 'The unique LinkedIn post ID',
  })
  @IsString()
  @IsNotEmpty()
  linkedinPostId!: string;

  @ApiProperty({
    example: 'https://www.linkedin.com/feed/update/urn:li:activity:123456789/',
    description: 'The LinkedIn post URL',
  })
  @IsString()
  @IsNotEmpty()
  linkedinUrl!: string;

  @ApiProperty({
    example: 'Mastering NestJS Microservices',
    description: 'The title of the LinkedIn post',
  })
  @IsString()
  @IsNotEmpty()
  articleTitle!: string;

  @ApiProperty({
    example:
      'In this post, we will explore how to build scalable microservices...',
    description: 'The content/body of the LinkedIn post',
    required: false,
  })
  @IsString()
  @IsOptional()
  articleContent?: string;

  @ApiProperty({
    example: 'https://media.licdn.com/media/...',
    description: 'The cover image or featured image of the post',
    required: false,
  })
  @IsString()
  @IsOptional()
  linkedinPicture?: string;

  @ApiProperty({
    example: 'Backend',
    enum: ['Backend', 'Frontend', 'AI', 'DevOps', 'Others'],
    required: false,
  })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiProperty({
    example: ['NestJS', 'Microservices', 'Node.js'],
    description: 'Tags for the post',
    required: false,
  })
  @IsArray()
  @IsOptional()
  tags?: string[];
}

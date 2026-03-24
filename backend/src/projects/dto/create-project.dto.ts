import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUrl,
  IsArray,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectDto {
  @ApiProperty({ 
    example: 'JobKit Platform', 
    description: 'The title of the project' 
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ 
    example: 'An AI-driven job matching platform connecting talent with opportunities...', 
    description: 'Detailed description of the project functionality' 
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ 
    type: [String], 
    example: ['NestJS', 'Next.js', 'Prisma', 'PostgreSQL'],
    description: 'List of technologies used in the project',
    required: false 
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  techStack?: string[];

  @ApiProperty({ 
    example: 'https://jobkit.app', 
    description: 'Public URL of the live project',
    required: false 
  })
  @IsUrl()
  @IsOptional()
  link?: string;

  @ApiProperty({ 
    example: 'https://github.com/sameh-dheir/jobkit', 
    description: 'URL of the GitHub repository',
    required: false 
  })
  @IsUrl()
  @IsOptional()
  github?: string;

  @ApiProperty({ 
    type: [String], 
    description: 'Array of image URLs (populated automatically via file upload)',
    required: false 
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];
}
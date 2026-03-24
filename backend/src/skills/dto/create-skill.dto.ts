import { IsString, IsNotEmpty, IsNumber, IsOptional, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSkillDto {
  @ApiProperty({ 
    example: 'NestJS', 
    description: 'The name of the technical skill' 
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ 
    example: 90, 
    description: 'Proficiency level from 0 to 100',
    minimum: 0,
    maximum: 100 
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  level: number;

  @ApiProperty({ 
    example: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nestjs/nestjs-plain.svg', 
    description: 'URL of the skill icon (SVG or Image)',
    required: false 
  })
  @IsString()
  @IsOptional()
  icon?: string;

  @ApiProperty({ 
    example: 'Backend', 
    description: 'Category of the skill (e.g., Frontend, Backend, Tools)',
    required: false 
  })
  @IsString()
  @IsOptional()
  category?: string;
}
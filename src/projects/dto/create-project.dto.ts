import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUrl,
  IsArray,
} from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  techStack?: string[];

  @IsUrl()
  @IsOptional()
  link?: string;

  @IsUrl()
  @IsOptional()
  github?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];
}

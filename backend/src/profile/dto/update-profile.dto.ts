import {
  IsOptional,
  IsString,
  IsEmail,
  MinLength,
  MaxLength,
} from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  title?: string;

  @IsOptional()
  @IsString()
  @MinLength(20, { message: 'The bio must be at least 20 characters long' })
  @MaxLength(500)
  bio?: string;

  @IsOptional()
  @IsString()
  cvUrl?: string;

  @IsOptional()
  profileImage?: any;
}

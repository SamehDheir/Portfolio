import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    example: 'sameh@example.com',
    description: 'The registered email address of the admin',
  })
  @IsEmail({}, { message: 'The email address is invalid' })
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'The secure password (minimum 6 characters)',
  })
  @IsString()
  @MinLength(6, { message: 'The password must be at least 6 characters long' })
  password: string;
}

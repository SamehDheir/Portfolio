import {
  Controller,
  Patch,
  Body,
  UseInterceptors,
  UploadedFile,
  Request,
  UseGuards,
  Get,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('profile')
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req) {
    const id = req.user.userId;
    return this.profileService.getProfile(id);
  }

  @Patch('update')
  @UseInterceptors(FileInterceptor('profileImage'))
  async update(
    @Request() req,
    @Body() dto: UpdateProfileDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.profileService.update(req.user.userId, dto, file);
  }
}

import {
  Controller,
  Patch,
  Body,
  UseInterceptors,
  UploadedFile,
  Request,
  UseGuards,
  Get,
  UploadedFiles,
  UnauthorizedException,
} from '@nestjs/common';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';

@ApiTags('Profile')
@Controller('profile')
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('me')
  @ApiBearerAuth()
  async getProfile(@Request() req) {
    return this.profileService.getProfile(req.user.userId);
  }
@Patch('update')
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'profileImage', maxCount: 1 },
      { name: 'cvFile', maxCount: 1 },
    ]),
  )
  async update(
    @Request() req,
    @Body() dto: UpdateProfileDto,
    @UploadedFiles() files: { profileImage?: Express.Multer.File[]; cvFile?: Express.Multer.File[] },
  ) {
    const id = req.user.id || req.user.sub || req.user.userId;

    if (!id) {
       console.log('User Object:', req.user);
       throw new UnauthorizedException('User ID not found in request');
    }

    return this.profileService.update(id, dto, files);
  }
}

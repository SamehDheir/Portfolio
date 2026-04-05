import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class ProfileService {
  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService,
  ) {}

  private async deleteOldFile(url: string | null) {
    if (url && url.includes('cloudinary')) {
      const parts = url.split('upload/');
      if (parts.length > 1) {
        const publicId = parts[1].split('/').slice(1).join('/').split('.')[0];
        await this.cloudinary.deleteFile(publicId);
      }
    }
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        title: true,
        bio: true,
        profileImage: true,
        cvUrl: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) throw new NotFoundException('User profile not found');
    return user;
  }

  async update(
    userId: string,
    dto: UpdateProfileDto,
    files?: {
      profileImage?: Express.Multer.File[];
      cvFile?: Express.Multer.File[];
    },
  ) {
    const user = await this.getProfile(userId);
    let imageUrl = user.profileImage;
    let cvUrl = user.cvUrl;

    if (files?.profileImage?.[0]) {
      await this.deleteOldFile(user.profileImage);
      const uploadRes = await this.cloudinary.uploadFile(
        files.profileImage[0],
        'portfolio/profile',
      );
      imageUrl = uploadRes.secure_url;
    }

    if (files?.cvFile?.[0]) {
      await this.deleteOldFile(user.cvUrl);
      const uploadRes = await this.cloudinary.uploadFile(
        files.cvFile[0],
        'portfolio/docs',
      );
      cvUrl = uploadRes.secure_url;
    }

    const { profileImage, cvUrl: dtoCvUrl, ...updateData } = dto;

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        ...updateData,
        profileImage: imageUrl,
        cvUrl: cvUrl,
      },
    });
  }
}

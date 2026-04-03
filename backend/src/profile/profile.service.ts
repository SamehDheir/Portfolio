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
        createdAt: true,
      },
    });

    if (!user) throw new NotFoundException('User profile not found');
    return user;
  }

  async update(
    userId: string,
    dto: UpdateProfileDto,
    file?: Express.Multer.File,
  ) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    let imageUrl = user.profileImage;

    if (file) {
      if (user.profileImage && user.profileImage.includes('cloudinary')) {
        await this.cloudinary.deleteFile(user.profileImage);
      }

      const uploadRes = await this.cloudinary.uploadFile(file);
      imageUrl = uploadRes.secure_url;
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        ...dto,
        profileImage: imageUrl,
      },
      select: {
        id: true,
        name: true,
        email: true,
        title: true,
        bio: true,
        profileImage: true,
        updatedAt: true,
      },
    });
  }
}
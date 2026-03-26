import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import * as fs from 'fs';
import { join } from 'path';

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) {}

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

  if (!user) {
    throw new NotFoundException('User profile not found');
  }

  return user;
}

  async update(
    userId: string,
    dto: UpdateProfileDto,
    file?: Express.Multer.File,
  ) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    let imagePath = user.profileImage;

    // 2. معالجة الصورة الجديدة
    if (file) {
      // حذف الصورة القديمة إذا لم تكن الافتراضية
      if (user.profileImage && !user.profileImage.includes('default.png')) {
        const oldPath = join(process.cwd(), 'public', user.profileImage);
        if (fs.existsSync(oldPath)) {
          try {
            fs.unlinkSync(oldPath);
          } catch (err) {
            console.error('Error deleting old image:', err);
          }
        }
      }
      imagePath = `/uploads/profiles/${file.filename}`;
    }

    // 3. التحديث في قاعدة البيانات
    // نستخدم Spread للـ dto ليدعم التحديث الجزئي تلقائياً
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        ...dto,
        profileImage: imagePath,
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

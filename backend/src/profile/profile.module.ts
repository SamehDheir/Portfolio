import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports: [
    CloudinaryModule,
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads/profiles',
        filename: (req, file, cb) => {
          const name = Date.now() + Math.round(Math.random() * 1e9);
          cb(null, `${name}${extname(file.originalname)}`);
        },
      }),
    }),
  ],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}
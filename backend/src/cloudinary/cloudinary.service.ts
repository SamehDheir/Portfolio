import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import * as streamifier from 'streamifier';

@Injectable()
export class CloudinaryService {
  async uploadFile(
    file: Express.Multer.File,
    folderName: string = 'portfolio/others',
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    const isPdf = file.mimetype === 'application/pdf';

    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        {
          folder: folderName,
          resource_type: isPdf ? 'raw' : 'auto',
          public_id: `${Date.now()}-${file.originalname.split('.')[0]}`,
          format: isPdf ? 'pdf' : undefined,
          type: 'upload',
          access_mode: 'public',
        },
        (error, result) => {
          if (error) return reject(error);
          if (result) resolve(result);
        },
      );

      streamifier.createReadStream(file.buffer).pipe(upload);
    });
  }

  async deleteFile(publicUrl: string) {
    try {
      if (!publicUrl) return;

      if (publicUrl.includes('upload/')) {
        const parts = publicUrl.split('upload/');
        const publicId = parts[1].split('/').slice(1).join('/').split('.')[0];

        console.log(`--- Cloudinary Delete Attempt ---`);
        console.log(`Target ID: ${publicId}`);

        return await cloudinary.uploader.destroy(publicId);
      }

      return await cloudinary.uploader.destroy(publicUrl);
    } catch (error) {
      console.error('Cloudinary delete error:', error);
      return { result: 'error', message: error.message };
    }
  }
}

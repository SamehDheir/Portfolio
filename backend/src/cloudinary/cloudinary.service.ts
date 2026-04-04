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
    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        {
          folder: folderName,
          resource_type: 'auto',
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
      if (publicUrl.includes('http')) {
        const parts = publicUrl.split('upload/');
        if (parts.length > 1) {
          const pathSegments = parts[1].split('/');
          const publicIdWithExt = pathSegments.slice(1).join('/'); 
          const publicId = publicIdWithExt.split('.')[0];
          
          console.log(`--- Cloudinary Delete Attempt ---`);
          console.log(`Target ID: ${publicId}`);
          
          const result = await cloudinary.uploader.destroy(publicId);
          console.log(`Result:`, result);
          return result;
        }
      }

      return await cloudinary.uploader.destroy(publicUrl);
    } catch (error) {
      console.error('Cloudinary delete error:', error);
      return { result: 'error', message: error.message };
    }
  }
}
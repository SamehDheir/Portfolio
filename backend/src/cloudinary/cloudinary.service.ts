import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryResponse } from './cloudinary-response';
const streamifier = require('streamifier');

@Injectable()
export class CloudinaryService {
  
  async uploadFile(file: Express.Multer.File): Promise<CloudinaryResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { 
          folder: 'portfolio_posts',
          resource_type: 'auto' 
        },
        (error, result) => {
          if (error) return reject(error);
         if (result) resolve(result);
        },
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  async deleteFile(url: string): Promise<any> {
    try {
      const segments = url.split('/');
      const fileNameWithExtension = segments.pop();
      const folder = segments.pop();
      const publicId = `${folder}/${fileNameWithExtension!.split('.')[0]}`;

      return new Promise((resolve, reject) => {
        cloudinary.uploader.destroy(publicId, (error, result) => {
          if (error) return reject(error);
          resolve(result);
        });
      });
    } catch (error) {
      console.error('Cloudinary Delete Error:', error);
    }
  }
}
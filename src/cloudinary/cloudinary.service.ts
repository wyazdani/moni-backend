import { Inject, Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

type CloudinaryType = typeof cloudinary;

@Injectable()
export class CloudinaryService {
  constructor(@Inject('Cloudinary') private cloudinary: CloudinaryType) {}

  uploadFile(file: Express.Multer.File, folder: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.cloudinary.uploader
        .upload_stream({ folder }, (error, uploadResult: any) => {
          if (error) reject(error);
          return resolve(uploadResult);
        })
        .end(file.buffer);
    });
  }

  async deleteFile(image_public_id: string): Promise<any> {
    return await this.cloudinary.uploader.destroy(image_public_id);
  }

  async deleteFiles(image_public_ids: string[]): Promise<any> {
    return await Promise.all(
      image_public_ids.map((item) => this.deleteFile(item)),
    );
  }
}

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createWriteStream, mkdir, ReadStream, unlink } from 'fs';
import * as path from 'path';
import { FileUpload } from 'graphql-upload';
import * as uuid from 'uuid';
import * as sharp from 'sharp';

import { ImageConfig, ImageResizerOptions } from '../interfaces';

@Injectable()
export class ImageService {
  constructor(private configService: ConfigService) {
  }

  private saveFile(
    uploadedFileStream: ReadStream,
    filesPath: string,
    fileName: string,
  ) {
    const saveFileStream = createWriteStream(path.join(filesPath, fileName));
    uploadedFileStream.pipe(saveFileStream);
  }

  private makeUploadDirectoryAndSave(
    commonDir: string,
    typeDir: string,
    idDir: string,
    saveFileCallback?: () => void,
  ) {
    mkdir(path.join(commonDir), { recursive: true }, err => {
      if (err) throw err;
      mkdir(path.join(commonDir, typeDir), { recursive: true }, err => {
        if (err) throw err;
        mkdir(idDir, { recursive: true }, err => {
          if (err) throw err;
          if (saveFileCallback) saveFileCallback();
        });
      });
    });
  }

  async saveUploadedFile(
    image: FileUpload,
    id: number,
    type: string,
  ): Promise<string> {
    const { filename: originalFileName, createReadStream } = await image;
    const uploadedFile = createReadStream();
    const newFileName = uuid.v4() + '_' + originalFileName;

    const UPLOAD_COMMON_DIR: string = this.configService.get<string>(
      'files.upload.type.main',
      'upload',
    );
    const UPLOAD_TYPE_DIR: string = this.configService.get<string>(
      `files.upload.type.${type}`,
      type,
    );

    const filesPath = path.join(
      UPLOAD_COMMON_DIR,
      UPLOAD_TYPE_DIR,
      id.toString(),
    );

    this.makeUploadDirectoryAndSave(
      UPLOAD_COMMON_DIR,
      UPLOAD_TYPE_DIR,
      filesPath,
      () => this.saveFile(uploadedFile, filesPath, newFileName),
    );

    return newFileName;
  }

  deleteImageFile(type: string, id: number, pictureName: string) {
    const UPLOAD_COMMON_DIR: string = this.configService.get<string>(
      'files.upload.type.main',
      'upload',
    );
    const UPLOAD_CATEGORIES_DIR: string = this.configService.get<string>(
      `files.upload.type.${type}`,
      type,
    );

    const filesPath = path.join(
      UPLOAD_COMMON_DIR,
      UPLOAD_CATEGORIES_DIR,
      id.toString(),
      pictureName,
    );

    unlink(filesPath, () => null);
  }

  async saveSomeImages(
    files: FileUpload[],
    existingNames: string[],
    id: number,
    type: string,
  ): Promise<string[]> {
    for (const image of files) {
      const currentImageName = await this.saveUploadedFile(image, id, type);
      existingNames.push(currentImageName);
    }
    return existingNames;
  }

  async resizer(options: ImageResizerOptions) {
    const { type, id, name, size } = options;

    let UPLOAD_TYPE_DIR: 'small' | 'medium' | 'large';

    if (!type || !id || !name || !size) {
      return null;
    } else {
      UPLOAD_TYPE_DIR = this.configService.get(`files.upload.type.${type}`);
      if (!UPLOAD_TYPE_DIR) return null;
    }

    const UPLOAD_COMMON_DIR: string =
      this.configService.get<string>('files.upload.type.main') || 'upload';

    const imagePath = path.join(UPLOAD_COMMON_DIR, UPLOAD_TYPE_DIR, id, name);

    const imageConfig: ImageConfig =
      this.configService.get(`files.upload.image.size.${size}`) || {};

    const image = sharp(imagePath);
    const metadata = await image.metadata();

    if (imageConfig.width && imageConfig.height) {
      image.resize(imageConfig.width, imageConfig.height, {
        fit: 'inside',
        withoutEnlargement: !imageConfig.upsize,
      });
    }

    if (
      imageConfig.output &&
      metadata.format &&
      imageConfig.types?.includes(metadata.format)
    ) {
      image.toFormat(imageConfig.output, { quality: imageConfig.quality });
    }

    //TODO: composite image with watermarks

    return image.withMetadata();
  };
}

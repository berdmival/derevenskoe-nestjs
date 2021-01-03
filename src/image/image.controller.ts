import { Controller, Get, Req, Res } from '@nestjs/common';
import { ImageResizerOptions } from '../interfaces';
import { OutputInfo } from 'sharp';
import { Request, Response } from 'express';
import { ImageService } from './image.service';

@Controller('img')
export class ImageController {

  constructor(private readonly imageService: ImageService) {}

  @Get('/:type/:id/:size/:image')
  async getImage(@Req() req: Request, @Res() res: Response) {
    try {
      const options: ImageResizerOptions = {
        type: req.params.type,
        id: req.params.id,
        name: req.params.image,
        size: <'small' | 'medium' | 'large'>req.params.size,
      };

      const result = await this.imageService.resizer(options);
      if (!result) {
        return res.status(404).json({
          message: `Image ${options.name} with size ${options.size} and for ${options.type} with id ${options.id} not found`,
        });
      }

      result.toBuffer((err: Error, data: Buffer, info: OutputInfo) => {
        if (err) throw Error(err.message);
        return res.type('jpeg').set('X-Sharp', JSON.stringify(info)).send(data);
      });

      return;
    } catch (error) {
      return res.status(500).json({ message: `Server error: ${error}` });
    }
  }
}

import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 } from 'uuid';

// https://docs.nestjs.com/techniques/file-upload
export const fileInterceptor = FileInterceptor('avatar', {
  storage: diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
      const fileType = String(file.originalname).split('.')[1];
      const filename = v4();
      cb(null, `${filename}.${fileType}`);
    },
  }),
});

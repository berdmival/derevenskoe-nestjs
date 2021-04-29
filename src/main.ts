import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from 'fs';
import * as cookieParser from 'cookie-parser';
import * as helmet from 'helmet';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

async function bootstrap() {
  const SERVER_PORT = Number.parseInt(<string>process.env.PORT);
  // const HTTPS_CRT = <string>process.env.HTTPS_CRT;
  // const HTTPS_KEY = <string>process.env.HTTPS_KEY;
  //
  // const httpsOptions: HttpsOptions = {
  //     cert: fs.readFileSync(HTTPS_CRT),
  //     key: fs.readFileSync(HTTPS_KEY),
  // };

  // TODO: security (helmet, cors etc.)

  const corsConf: CorsOptions = {
    // origin: [
    //   'http://localhost:4200',
    //   'http://192.168.56.1:4200',
    //   'https://localhost:4200',
    //   'https://192.168.56.1:4200',
    // ],
    origin: true, // TODO: change before production
    exposedHeaders: ['X-Pagination', 'Authorization'],
    credentials: true,
  };

  // const app = await NestFactory.create(AppModule, {httpsOptions});
  const app = await NestFactory.create(AppModule);
  app.use(helmet({ contentSecurityPolicy: false })); //TODO: add helmet options
  app.enableCors(corsConf);
  app.use(cookieParser(process.env.COOKIE_SECRET));

  await app.listen(SERVER_PORT);
}

bootstrap();

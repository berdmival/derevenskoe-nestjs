import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import * as fs from 'fs';
import * as cookieParser from 'cookie-parser';
import * as helmet from 'helmet';
import {HttpsOptions} from "@nestjs/common/interfaces/external/https-options.interface";

async function bootstrap() {
    const SERVER_PORT = Number.parseInt(<string>process.env.PORT);
    const HTTPS_CRT = <string>process.env.HTTPS_CRT;
    const HTTPS_KEY = <string>process.env.HTTPS_KEY;

    const httpsOptions: HttpsOptions = {
        cert: fs.readFileSync(HTTPS_CRT),
        key: fs.readFileSync(HTTPS_KEY),
    };

    // TODO: security (helmet, cors etc.)

    const corsConf = {
        origin: [
            'http://localhost:3000',
            'http://192.168.56.1:3000',
            'https://localhost:3000',
            'https://192.168.56.1:3000',
        ],
        exposedHeaders: ['X-Pagination', 'Authorization'],
        credentials: true,
    };

    const app = await NestFactory.create(AppModule, {httpsOptions});
    // const app = await NestFactory.create(AppModule);
    app.use(helmet()); //TODO: add helmet options
    app.enableCors(corsConf);
    app.use(cookieParser(process.env.COOKIE_SECRET));

    await app.listen(SERVER_PORT);
}

bootstrap();

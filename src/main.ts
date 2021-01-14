import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import * as fs from 'fs';
import * as cookieParser from 'cookie-parser';
import * as helmet from 'helmet';

async function bootstrap() {
    const SERVER_PORT = Number.parseInt(<string>process.env.PORT);
    const SERVER_PFX = <string>process.env.HTTPS_PFX;
    const SERVER_PASSPHRASE = <string>process.env.HTTPS_PASSPHRASE;

    const httpsOptions = {
        pfx: fs.readFileSync(SERVER_PFX),
        passphrase: SERVER_PASSPHRASE,
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
    app.use(helmet()); //TODO: add helmet options
    app.enableCors(corsConf);
    app.use(cookieParser(process.env.COOKIE_SECRET));

    await app.listen(SERVER_PORT);
}

bootstrap();

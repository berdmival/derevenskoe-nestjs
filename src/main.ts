import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from 'fs';

async function bootstrap() {
  const SERVER_PORT = Number.parseInt(<string>process.env.PORT);
  const SERVER_PFX = <string>process.env.HTTPS_PFX;
  const SERVER_PASSPHRASE = <string>process.env.HTTPS_PASSPHRASE;

  const httpsOptions = {
    pfx: fs.readFileSync(SERVER_PFX),
    passphrase: SERVER_PASSPHRASE,
  };

  // TODO: security (helmet, cors etc.)

  const app = await NestFactory.create(AppModule, { httpsOptions });
  await app.listen(SERVER_PORT);
}
bootstrap();

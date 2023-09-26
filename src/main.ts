import { NestFactory } from '@nestjs/core';
import { AzureStorageModule } from './azure-storage.module';

async function bootstrap() {
  const app = await NestFactory.create(AzureStorageModule);
  await app.listen(3000);
}
bootstrap();

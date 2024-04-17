import { Module } from '@nestjs/common';
import { ServerService } from './server.service';
import { ServerController } from './server.controller';
import { ServerRepository } from './server.repository';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [ServerService, ServerRepository],
  controllers: [ServerController],
  exports: [ServerRepository],
})
export class ServerModule {}

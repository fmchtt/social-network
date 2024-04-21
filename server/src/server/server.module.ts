import { Module, forwardRef } from '@nestjs/common';
import { ServerService } from './server.service';
import { ServerController } from './server.controller';
import { ServerRepository } from './server.repository';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MessageModule } from 'src/message/message.module';

@Module({
  imports: [PrismaModule, forwardRef(() => MessageModule)],
  providers: [ServerService, ServerRepository],
  controllers: [ServerController],
  exports: [ServerRepository],
})
export class ServerModule {}

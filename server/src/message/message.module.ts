import { Module } from '@nestjs/common';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MessageRepository } from './message.repository';
import { ChannelModule } from 'src/channel/channel.module';

@Module({
  imports: [PrismaModule, ChannelModule],
  controllers: [MessageController],
  providers: [MessageService, MessageRepository],
  exports: [MessageRepository, MessageService],
})
export class MessageModule {}

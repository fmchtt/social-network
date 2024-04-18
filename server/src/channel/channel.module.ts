import { Module } from '@nestjs/common';
import { ChannelController } from './channel.controller';
import { ChannelService } from './channel.service';
import { ChannelRepository } from './channel.repository';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ServerModule } from 'src/server/server.module';

@Module({
  imports: [PrismaModule, ServerModule],
  controllers: [ChannelController],
  providers: [ChannelService, ChannelRepository],
  exports: [ChannelRepository],
})
export class ChannelModule {}

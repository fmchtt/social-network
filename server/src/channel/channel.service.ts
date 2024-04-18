import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ChannelRepository } from './channel.repository';
import {
  CreateChannelCommand,
  EditChannelCommand,
  DeleteChannelCommand,
} from './channel.commands';
import { ServerRepository } from 'src/server/server.repository';
import { MessageResult } from 'src/app.results';

@Injectable()
export class ChannelService {
  constructor(
    private channelRepository: ChannelRepository,
    private serverRepository: ServerRepository,
  ) {}

  public async createChannel(command: CreateChannelCommand) {
    const server = await this.serverRepository.getByIdentifier(
      command.serverIdentifier,
    );
    if (server.ownerId !== command.userId) {
      throw new UnauthorizedException({
        message: 'Only server owner can create channels',
      });
    }

    return await this.channelRepository.create(command);
  }

  public async editChannel(command: EditChannelCommand) {
    const canEdit = await this.channelRepository.verifyPermission(
      command.channelId,
      command.userId,
    );

    if (!canEdit) {
      throw new UnauthorizedException({
        message: 'Only server owner can create channels',
      });
    }

    return await this.channelRepository.edit(command);
  }

  public async deleteChannel(command: DeleteChannelCommand) {
    const canDelete = await this.channelRepository.verifyPermission(
      command.channelId,
      command.userId,
    );

    if (!canDelete) {
      throw new UnauthorizedException({
        message: 'Only server owner can create channels',
      });
    }

    await this.channelRepository.delete(command.channelId);
    return new MessageResult('Channel deleted successfully');
  }
}

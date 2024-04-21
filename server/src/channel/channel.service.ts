import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ChannelRepository } from './channel.repository';
import {
  CreateChannelCommand,
  EditChannelCommand,
  DeleteChannelCommand,
} from './channel.commands';
import { ServerRepository } from 'src/server/server.repository';
import { MessageResult } from 'src/app.results';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  ChannelCreatedEvent,
  ChannelDeletedEvent,
  ChannelEditedEvent,
} from './channel.events';

@Injectable()
export class ChannelService {
  constructor(
    private channelRepository: ChannelRepository,
    private serverRepository: ServerRepository,
    private eventEmitter: EventEmitter2,
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

    const channel = await this.channelRepository.create(command);

    this.eventEmitter.emit('channel.created', new ChannelCreatedEvent(channel));

    return channel;
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

    const channel = await this.channelRepository.edit(command);

    this.eventEmitter.emit('channel.edited', new ChannelEditedEvent(channel));

    return channel;
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

    const channel = await this.channelRepository.delete(command.channelId);

    this.eventEmitter.emit('channel.deleted', new ChannelDeletedEvent(channel));

    return new MessageResult('Channel deleted successfully');
  }
}

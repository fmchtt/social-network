import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { MessageRepository } from './message.repository';
import { GetMessagesQuery } from './message.queries';
import {
  CreateMessageCommand,
  DeleteMessageCommand,
  EditMessageCommand,
} from './message.commands';
import { ChannelRepository } from 'src/channel/channel.repository';
import { MessageResult } from 'src/app.results';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  MessageCreatedEvent,
  MessageDeletedEvent,
  MessageEditedEvent,
} from './message.events';

@Injectable()
export class MessageService {
  constructor(
    private messageRepository: MessageRepository,
    private channelRepository: ChannelRepository,
    private eventEmitter: EventEmitter2,
  ) {}

  public async getMessages(query: GetMessagesQuery) {
    return await this.messageRepository.getByChannelId(
      query.channelId,
      query.page,
      query.userId,
    );
  }

  public async createMessage(command: CreateMessageCommand) {
    const channel = await this.channelRepository.verifyParticipant(
      command.channelId,
      command.userId,
    );
    if (!channel) {
      throw new NotFoundException({ message: 'Channel not found' });
    }

    const message = await this.messageRepository.create(command);

    this.eventEmitter.emit('message.created', new MessageCreatedEvent(message));

    return message;
  }

  public async editMessage(command: EditMessageCommand) {
    const message = await this.messageRepository.getById(command.messageId);
    if (message.authorId !== command.userId) {
      throw new UnauthorizedException({
        message: 'Only the author can update the message',
      });
    }

    const messageEdited = await this.messageRepository.edit(command);

    this.eventEmitter.emit(
      'message.edited',
      new MessageEditedEvent(messageEdited),
    );

    return messageEdited;
  }

  public async deleteMessage(command: DeleteMessageCommand) {
    const message = await this.messageRepository.getById(command.messageId);
    if (message.authorId !== command.userId) {
      throw new UnauthorizedException({
        message: 'Only the author can delete the message',
      });
    }

    await this.messageRepository.delete(message.id);

    this.eventEmitter.emit('message.deleted', new MessageDeletedEvent(message));

    return new MessageResult('Message delete sucessfully');
  }
}

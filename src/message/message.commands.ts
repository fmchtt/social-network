import { IsString } from 'class-validator';

export class CreateMessageCommand {
  @IsString()
  text: string;
  userId: number;
  channelId: number;
}

export class EditMessageCommand {
  @IsString()
  text?: string;
  userId: number;
  messageId: number;
}

export class DeleteMessageCommand {
  userId: number;
  messageId: number;

  constructor(userId: number, messageId: number) {
    this.userId = userId;
    this.messageId = messageId;
  }
}

import { IsString } from 'class-validator';

export class CreateChannelCommand {
  @IsString()
  name: string;
  serverIdentifier: string;
  userId: number;
}

export class EditChannelCommand {
  @IsString()
  name?: string;
  channelId: number;
  userId: number;
}

export class DeleteChannelCommand {
  channelId: number;
  userId: number;

  constructor(channelId: number, userId: number) {
    this.channelId = channelId;
    this.userId = userId;
  }
}

import { Channel } from '@prisma/client';

export class ChannelResult {
  id: number;
  name: string;

  constructor(channel: Channel) {
    this.id = channel.id;
    this.name = channel.name;
  }
}

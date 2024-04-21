import { Channel } from '@prisma/client';

export class ChannelCreatedEvent {
  id: number;
  payload: Channel;

  constructor(channel: Channel) {
    this.id = channel.id;
    this.payload = channel;
  }
}

export class ChannelEditedEvent {
  id: number;
  payload: Channel;

  constructor(channel: Channel) {
    this.id = channel.id;
    this.payload = channel;
  }
}

export class ChannelDeletedEvent {
  id: number;
  payload: Channel;

  constructor(channel: Channel) {
    this.id = channel.id;
    this.payload = channel;
  }
}

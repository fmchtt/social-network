import { Message } from '@prisma/client';

export class MessageCreatedEvent {
  id: number;
  payload: Message;

  constructor(message: Message) {
    this.id = message.id;
    this.payload = message;
  }
}

export class MessageEditedEvent {
  id: number;
  payload: Message;

  constructor(message: Message) {
    this.id = message.id;
    this.payload = message;
  }
}

export class MessageDeletedEvent {
  id: number;
  payload: Message;

  constructor(message: Message) {
    this.id = message.id;
    this.payload = message;
  }
}

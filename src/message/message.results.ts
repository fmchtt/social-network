import { Message, User } from '@prisma/client';
import { UserResult } from 'src/user/user.results';

export class MessageResult {
  id: number;
  text: string;
  author: UserResult;
  createdAt: Date;
  updatedAt: Date;

  constructor(message: Message & { author: User }) {
    this.id = message.id;
    this.text = message.text;
    this.author = new UserResult(message.author);
    this.createdAt = message.createdAt;
    this.updatedAt = message.updatedAt;
  }
}

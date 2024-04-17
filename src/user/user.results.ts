import { User } from '@prisma/client';

export class UserResult {
  name: string;
  username: string;

  constructor(user: User) {
    this.name = user.name;
    this.username = user.username;
  }
}

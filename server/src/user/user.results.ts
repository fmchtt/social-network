import { User } from '@prisma/client';

export class UserResult {
  id: number;
  name: string;
  username: string;

  constructor(user: User) {
    this.id = user.id;
    this.name = user.name;
    this.username = user.username;
  }
}

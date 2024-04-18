import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserCommand, UpdateUserCommand } from '../auth/auth.commands';
import { User } from '@prisma/client';

@Injectable()
export default class UserRepository {
  constructor(private db: PrismaService) {}

  async getById(id: number): Promise<User | undefined> {
    return await this.db.user.findFirst({ where: { id: id } });
  }

  async getByUsername(username: string): Promise<User | undefined> {
    return await this.db.user.findFirst({ where: { username: username } });
  }

  async create(command: CreateUserCommand): Promise<User> {
    const user = await this.db.user.create({ data: command });
    return user;
  }

  async update(command: UpdateUserCommand): Promise<User> {
    const user = await this.db.user.update({
      where: { id: command.userId },
      data: { name: command.name, password: command.password },
    });
    return user;
  }

  async delete(id: number): Promise<void> {
    await this.db.user.delete({ where: { id: id } });
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMessageCommand, EditMessageCommand } from './message.commands';

const PAGE_SIZE = 40;

@Injectable()
export class MessageRepository {
  constructor(private prisma: PrismaService) {}

  public async getByChannelId(id: number, page: number, userId: number) {
    return await this.prisma.message.findMany({
      where: {
        channelId: id,
        channel: {
          server: {
            OR: [
              {
                participants: {
                  some: {
                    userId: userId,
                  },
                },
              },
              {
                ownerId: userId,
              },
            ],
          },
        },
      },
      take: PAGE_SIZE,
      skip: (page - 1) * PAGE_SIZE,
      include: {
        author: true,
      },
    });
  }

  public async getById(id: number) {
    return await this.prisma.message.findFirst({
      where: {
        id: id,
      },
    });
  }

  public async create(command: CreateMessageCommand) {
    return await this.prisma.message.create({
      data: {
        channelId: command.channelId,
        text: command.text,
        authorId: command.userId,
      },
      include: {
        author: true,
      },
    });
  }

  public async edit(command: EditMessageCommand) {
    const updateData = {};

    if (command.text) {
      updateData['text'] = command.text;
    }

    return await this.prisma.message.update({
      where: {
        id: command.messageId,
      },
      data: updateData,
      include: {
        author: true,
      },
    });
  }

  public async delete(id: number) {
    return await this.prisma.message.delete({
      where: {
        id: id,
      },
    });
  }
}

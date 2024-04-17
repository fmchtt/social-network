import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateChannelCommand, EditChannelCommand } from './channel.commands';

@Injectable()
export class ChannelRepository {
  constructor(private prisma: PrismaService) {}

  public async getById(id: number) {
    return await this.prisma.channel.findFirst({
      where: {
        id: id,
      },
    });
  }

  public async verifyPermission(channelId: number, userId: number) {
    const channel = await this.prisma.channel.count({
      where: {
        id: channelId,
        server: {
          ownerId: userId,
        },
      },
    });

    return channel > 0;
  }

  public async verifyParticipant(id: number, userId: number) {
    const channel = await this.prisma.channel.count({
      where: {
        id: id,
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
    });
    return channel > 0;
  }

  public async create(command: CreateChannelCommand) {
    return await this.prisma.channel.create({
      data: {
        name: command.name,
        server: {
          connect: {
            identifier: command.serverIdentifier,
          },
        },
      },
    });
  }

  public async edit(command: EditChannelCommand) {
    const updateData = {};

    if (command.name) {
      updateData['name'] = command.name;
    }

    return await this.prisma.channel.update({
      where: {
        id: command.channelId,
        server: {
          ownerId: command.userId,
        },
      },
      data: updateData,
    });
  }

  public async delete(channelId: number) {
    await this.prisma.channel.delete({ where: { id: channelId } });
  }
}

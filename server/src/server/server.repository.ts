import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateServerCommand, EditServerCommand } from './server.commands';

@Injectable()
export class ServerRepository {
  constructor(private prisma: PrismaService) {}

  public async getParticipating(userId: number) {
    return await this.prisma.server.findMany({
      where: {
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
    });
  }

  public async getDetailsByIdentifier(identifier: string, userId: number) {
    return await this.prisma.server.findFirst({
      where: {
        identifier: identifier,
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
      include: {
        participants: {
          include: {
            user: true,
          },
        },
        channels: true,
      },
    });
  }

  public async connect(id: number, userId: number) {
    await this.prisma.userOnServer.create({
      data: {
        serverId: id,
        userId: userId,
      },
    });
  }

  public async getByIdentifier(identifier: string) {
    return await this.prisma.server.findFirst({
      where: {
        identifier: identifier,
      },
    });
  }

  public async create(command: CreateServerCommand) {
    return await this.prisma.server.create({
      data: {
        name: command.name,
        ownerId: command.userId,
        channels: {
          create: {
            name: 'Welcome 🎊',
          },
        },
      },
    });
  }

  public async edit(id: number, command: EditServerCommand) {
    const updateData = {};

    if (command.name) {
      updateData['name'] = command.name;
    }

    return await this.prisma.server.update({
      where: {
        id: id,
      },
      data: updateData,
    });
  }

  public async deleteServer(serverId: number) {
    await this.prisma.server.delete({
      where: {
        id: serverId,
      },
    });
  }
}

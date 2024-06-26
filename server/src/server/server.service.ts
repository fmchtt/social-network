import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  CreateServerCommand,
  DeleteServerCommand,
  EditServerCommand,
  EnterServerCommand,
} from './server.commands';
import { ServerRepository } from './server.repository';
import { MessageResult } from 'src/app.results';
import { ServerDetailedResult, ServerResult } from './server.results';
import { GetServerByIdentifier, GetUserServersQuery } from './server.queries';
import { MessageRepository } from 'src/message/message.repository';
import { CreateMessageCommand } from 'src/message/message.commands';
import { MessageService } from 'src/message/message.service';

@Injectable()
export class ServerService {
  constructor(
    private serverRepository: ServerRepository,
    private messageService: MessageService,
  ) {}

  public async getServers(query: GetUserServersQuery) {
    const servers = await this.serverRepository.getParticipating(query.userId);
    return servers.map((server) => new ServerResult(server, query.userId));
  }

  public async getServerByIdentifier(query: GetServerByIdentifier) {
    const server = await this.serverRepository.getDetailsByIdentifier(
      query.identifier,
      query.userId,
    );
    return new ServerDetailedResult(server);
  }

  public async connectServer(command: EnterServerCommand) {
    const server = await this.serverRepository.getByIdentifier(
      command.identifier,
    );
    if (!server) {
      throw new NotFoundException({ message: 'Server not found' });
    }
    await this.serverRepository.connect(server.id, command.userId);

    const detailedServer = await this.serverRepository.getDetailsByIdentifier(
      command.identifier,
      command.userId,
    );

    const messageCommand = new CreateMessageCommand();
    messageCommand.channelId = detailedServer.channels.at(0).id;
    messageCommand.userId = command.userId;
    messageCommand.text = 'Hiii! I arrieved at the server!!';

    await this.messageService.create(messageCommand);

    return detailedServer;
  }

  public async createServer(command: CreateServerCommand) {
    const server = await this.serverRepository.create(command);
    return new ServerResult(server, command.userId);
  }

  public async editServer(command: EditServerCommand) {
    const server = await this.serverRepository.getByIdentifier(
      command.identifier,
    );
    if (!server) {
      throw new NotFoundException({
        message: 'Only the owner can delete a server',
      });
    }

    if (server.ownerId !== command.userId) {
      throw new UnauthorizedException({
        message: 'Only the owner can delete a server',
      });
    }

    return await this.serverRepository.edit(server.id, command);
  }

  public async deleteServer(command: DeleteServerCommand) {
    const server = await this.serverRepository.getByIdentifier(
      command.identifier,
    );
    if (!server) {
      throw new NotFoundException({ message: 'Server not found!' });
    }

    if (server.ownerId !== command.userId) {
      throw new UnauthorizedException({
        message: 'Only the owner can delete a server',
      });
    }

    await this.serverRepository.deleteServer(server.id);

    return new MessageResult('Server deleted successfully');
  }
}

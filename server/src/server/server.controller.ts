import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import {
  CreateServerCommand,
  DeleteServerCommand,
  EditServerCommand,
  EnterServerCommand,
} from './server.commands';
import { GetServerByIdentifier, GetUserServersQuery } from './server.queries';
import { ServerService } from './server.service';
import { ServerDetailedResult, ServerResult } from './server.results';

@Controller('server')
export class ServerController {
  constructor(private serverService: ServerService) {}

  @Get()
  public async getServers(@Req() request: Request) {
    const query = new GetUserServersQuery();
    query.userId = request.user.id;
    return await this.serverService.getServers(query);
  }

  @Get(':identifier')
  public async getServerDetails(
    @Param('identifier', ParseUUIDPipe) identifier: string,
    @Req() request: Request,
  ) {
    const query = new GetServerByIdentifier();
    query.identifier = identifier;
    query.userId = request.user.id;
    return await this.serverService.getServerByIdentifier(query);
  }

  @Post('connect/:identifier')
  public async connectToServer(
    @Param('identifier', ParseUUIDPipe) identifier: string,
    @Req() request: Request,
  ) {
    const command = new EnterServerCommand();
    command.identifier = identifier;
    command.userId = request.user.id;
    const server = await this.serverService.connectServer(command);
    return new ServerResult(server, request.user.id);
  }

  @Post()
  public async createServer(
    @Req() request: Request,
    @Body() command: CreateServerCommand,
  ) {
    command.userId = request.user.id;
    return await this.serverService.createServer(command);
  }

  @Patch(':identifier')
  public async editServer(
    @Param('identifier', ParseUUIDPipe) identifier: string,
    @Body() command: EditServerCommand,
    @Req() request: Request,
  ) {
    command.userId = request.user.id;
    command.identifier = identifier;
    const server = await this.serverService.editServer(command);
    return new ServerResult(server, request.user.id);
  }

  @Delete(':identifier')
  public async deleteServer(
    @Param('identifier', ParseUUIDPipe) identifier: string,
    @Req() request: Request,
  ) {
    const command = new DeleteServerCommand();
    command.identifier = identifier;
    command.userId = request.user.id;

    return await this.serverService.deleteServer(command);
  }
}

import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { ChannelService } from './channel.service';
import { Request } from 'express';
import {
  CreateChannelCommand,
  DeleteChannelCommand,
  EditChannelCommand,
} from './channel.commands';
import { ChannelResult } from './channel.results';

@Controller('channel')
export class ChannelController {
  constructor(private channelService: ChannelService) {}

  @Post(':serverIdentifier')
  public async createChannel(
    @Param('serverIdentifier', ParseUUIDPipe) identifier: string,
    @Body() command: CreateChannelCommand,
    @Req() request: Request,
  ) {
    command.userId = request.user.id;
    command.serverIdentifier = identifier;
    const channel = await this.channelService.createChannel(command);
    return new ChannelResult(channel);
  }

  @Patch(':channelId')
  public async editChannel(
    @Param('channelId', ParseIntPipe) channelId: number,
    @Body() command: EditChannelCommand,
    @Req() request: Request,
  ) {
    command.userId = request.user.id;
    command.channelId = channelId;
    const channel = await this.channelService.editChannel(command);
    return new ChannelResult(channel);
  }

  @Delete(':channelId')
  public async deleteChannel(
    @Param('channelId', ParseIntPipe) channelId: number,
    @Req() request: Request,
  ) {
    const command = new DeleteChannelCommand(channelId, request.user.id);
    return await this.channelService.deleteChannel(command);
  }
}

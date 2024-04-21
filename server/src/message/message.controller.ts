import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { GetMessagesQuery } from './message.queries';
import { Request } from 'express';
import { MessageResult } from './message.results';
import {
  CreateMessageCommand,
  DeleteMessageCommand,
  EditMessageCommand,
} from './message.commands';
import { MessageService } from './message.service';

@Controller('message')
export class MessageController {
  constructor(private messageService: MessageService) {}

  @Get(':channelId')
  public async getMessages(
    @Query() query: GetMessagesQuery,
    @Param('channelId', ParseIntPipe) channelId: number,
    @Req() request: Request,
  ) {
    query.page = query.page || 1;
    query.userId = request.user.id;
    query.channelId = channelId;
    const messages = await this.messageService.getMessages(query);

    return messages.map((message) => new MessageResult(message));
  }

  @Post(':channelId')
  public async sendMessage(
    @Param('channelId', ParseIntPipe) channelId: number,
    @Body() command: CreateMessageCommand,
    @Req() request: Request,
  ) {
    command.channelId = channelId;
    command.userId = request.user.id;
    const message = await this.messageService.create(command);
    return new MessageResult(message);
  }

  @Patch(':messageId')
  public async updateMessage(
    @Param('messageId', ParseIntPipe) messageId: number,
    @Body() command: EditMessageCommand,
    @Req() request: Request,
  ) {
    command.userId = request.user.id;
    command.messageId = messageId;

    const message = await this.messageService.edit(command);
    return new MessageResult(message);
  }

  @Delete(':messageId')
  public async deleteMessage(
    @Param('messageId', ParseIntPipe) messageId: number,
    @Req() request: Request,
  ) {
    const command = new DeleteMessageCommand(request.user.id, messageId);
    return await this.messageService.delete(command);
  }
}

import { OnEvent } from '@nestjs/event-emitter';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import {
  MessageCreatedEvent,
  MessageDeletedEvent,
  MessageEditedEvent,
} from './message/message.events';
import {
  ChannelCreatedEvent,
  ChannelDeletedEvent,
  ChannelEditedEvent,
} from './channel/channel.events';

type ChannelMessage = {
  type: 'join' | 'leave';
  channelId: number;
};

type ServerMessage = {
  type: 'join' | 'leave';
  serverId: number;
};

@WebSocketGateway({ cors: '*' })
export class AppGateway {
  @WebSocketServer()
  socketServer: Server;

  @SubscribeMessage('channel')
  public manageChannel(
    @MessageBody() message: ChannelMessage,
    @ConnectedSocket() socket: Socket,
  ) {
    if (message.type === 'join') socket.join(`channel-${message.channelId}`);
    else socket.leave(`channel-${message.channelId}`);

    return 'success';
  }

  @SubscribeMessage('server')
  public manageServer(
    @MessageBody() message: ServerMessage,
    @ConnectedSocket() socket: Socket,
  ) {
    if (message.type === 'join') socket.join(`server-${message.serverId}`);
    else socket.leave(`server-${message.serverId}`);

    return 'success';
  }

  @OnEvent('message.created')
  public messageCreated(event: MessageCreatedEvent) {
    this.socketServer
      .to(`channel-${event.payload.channelId}`)
      .emit('message.created', event);
  }

  @OnEvent('message.edited')
  public messageEdited(event: MessageEditedEvent) {
    this.socketServer
      .to(`channel-${event.payload.channelId}`)
      .emit('message.edited', event);
  }

  @OnEvent('message.deleted')
  public messageDeleted(event: MessageDeletedEvent) {
    this.socketServer
      .to(`channel-${event.payload.channelId}`)
      .emit('message.deleted', event);
  }

  @OnEvent('channel.created')
  public channelCreated(event: ChannelCreatedEvent) {
    this.socketServer
      .to(`server-${event.payload.serverId}`)
      .emit('channel.created', event);
  }

  @OnEvent('channel.edited')
  public channelEdited(event: ChannelEditedEvent) {
    this.socketServer
      .to(`server-${event.payload.serverId}`)
      .emit('channel.edited', event);
  }

  @OnEvent('channel.deleted')
  public channelDeleted(event: ChannelDeletedEvent) {
    this.socketServer
      .to(`server-${event.payload.serverId}`)
      .emit('channel.deleted', event);
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from './auth.service';
import { Observable } from 'rxjs';
import { SocketEvent, SocketService } from './socket.service';
import { EventSubscribed } from '../global.types';

export type Message = {
  id: number;
  text: string;
  author: User;
  createdAt: string;
  updatedAt: string;
};

export type SubscribedMessage = EventSubscribed<Message>;

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  constructor(
    private httpClient: HttpClient,
    private socketService: SocketService,
  ) {}

  public getMessages(channelId: number) {
    return this.httpClient.get<Message[]>(`message/${channelId}`);
  }

  public listenMessages(channelId: number) {
    this.socketService.socket.emit(
      'channel',
      { type: 'join', channelId },
      (val: string) => {
        console.info('JOINING CHANNEL:', channelId, 'STATUS:', val);
      },
    );
    return new Observable<SubscribedMessage>((observer) => {
      this.socketService.socket.on(
        'message.created',
        (data: SocketEvent<Message>) => {
          observer.next({ type: 'created', data: data.payload });
        },
      );
      this.socketService.socket.on(
        'message.edited',
        (data: SocketEvent<Message>) => {
          observer.next({ type: 'edited', data: data.payload });
        },
      );
      this.socketService.socket.on(
        'message.deleted',
        (data: SocketEvent<Message>) => {
          observer.next({ type: 'deleted', data: data.payload });
        },
      );
      return () =>
        this.socketService.socket.emit(
          'channel',
          { type: 'leave', channelId },
          () =>
            this.socketService.socket.emit(
              'channel',
              { type: 'leave', channelId },
              (val: string) => {
                console.info('LEAVING CHANNEL:', channelId, 'STATUS', val);
              },
            ),
        );
    });
  }

  public sendMessage(channelId: number, text: string) {
    return this.httpClient.post(`message/${channelId}`, { text });
  }

  public deleteMessage(messageId: number) {
    return this.httpClient.delete(`message/${messageId}`);
  }
}

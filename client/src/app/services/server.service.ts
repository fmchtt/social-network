import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { User } from './auth.service';
import { Observable, tap } from 'rxjs';
import { SocketEvent, SocketService } from './socket.service';
import { EventSubscribed } from '../global.types';

export type Server = {
  name: string;
  identifier: string;
  isOwner: boolean;
};

export type Channel = {
  id: number;
  name: string;
};

export type DetailedServer = {
  id: number;
  name: string;
  identifier: string;
  ownerId: number;
  participants: User[];
  channels: Channel[];
};

export type SubscribedChannel = EventSubscribed<Channel>;

@Injectable({
  providedIn: 'root',
})
export class ServerService {
  constructor(
    private httpClient: HttpClient,
    private socketService: SocketService,
  ) {}

  public servers = signal<Server[]>([]);

  public getServers() {
    return this.httpClient.get<Server[]>('server').pipe(
      tap((response) => {
        this.servers.set(response);
      }),
    );
  }

  public getServerDetail(id: string) {
    return this.httpClient.get<DetailedServer>(`server/${id}`);
  }

  public createServer(name: string) {
    return this.httpClient.post<Server>('server', { name }).pipe(
      tap((response) => {
        this.servers.update((prev) => {
          prev.push(response);
          return prev;
        });
      }),
    );
  }

  public listenServer(serverId: number) {
    this.socketService.socket.emit(
      'server',
      { type: 'join', serverId },
      (value: string) => {
        console.info('JOINING SERVER:', serverId, 'STATUS', value);
      },
    );

    return new Observable<SubscribedChannel>((subscriber) => {
      this.socketService.socket.on(
        'channel.created',
        (data: SocketEvent<Channel>) => {
          subscriber.next({ type: 'created', data: data.payload });
        },
      );

      this.socketService.socket.on(
        'channel.edited',
        (data: SocketEvent<Channel>) => {
          subscriber.next({ type: 'edited', data: data.payload });
        },
      );

      this.socketService.socket.on(
        'channel.deleted',
        (data: SocketEvent<Channel>) => {
          subscriber.next({ type: 'deleted', data: data.payload });
        },
      );
      return () =>
        this.socketService.socket.emit(
          'server',
          { type: 'leave', serverId },
          (value: string) => {
            console.info('LEAVING SERVER:', serverId, 'STATUS', value);
          },
        );
    });
  }
}

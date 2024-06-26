import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { environment } from '../../environments/environment';

export type SocketEvent<T> = {
  id: number;
  payload: T;
};

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  public socket;

  constructor() {
    this.socket = io(
      environment.SOCKET_URL ||
        `${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${
          window.location.host
        }`,
      {
        transports: ['websocket'],
        secure: true,
      }
    );
  }
}

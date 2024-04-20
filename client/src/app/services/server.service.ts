import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { User } from './auth.service';
import { tap } from 'rxjs';

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
  name: string;
  identifier: string;
  participants: User[];
  channels: Channel[];
};

@Injectable({
  providedIn: 'root',
})
export class ServerService {
  constructor(private httpClient: HttpClient) {}

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
}

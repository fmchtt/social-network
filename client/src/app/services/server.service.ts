import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from './auth.service';

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

  public getServers() {
    return this.httpClient.get<Server[]>('server');
  }

  public getServerDetail(id: string) {
    return this.httpClient.get<DetailedServer>(`server/${id}`);
  }
}

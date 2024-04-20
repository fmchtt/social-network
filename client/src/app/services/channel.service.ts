import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Channel } from './server.service';

@Injectable({
  providedIn: 'root',
})
export class ChannelService {
  constructor(private httpClient: HttpClient) {}

  public createChannel(serverId: string, name: string) {
    return this.httpClient.post<Channel>(`channel/${serverId}`, { name });
  }
}

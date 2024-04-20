import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from './auth.service';

export type Message = {
  id: number;
  text: string;
  author: User;
  createdAt: string;
  updatedAt: string;
};

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  constructor(private httpClient: HttpClient) {}

  public getMessages(channelId: number) {
    return this.httpClient.get<Message[]>(`message/${channelId}`);
  }

  public sendMessage(channelId: number, text: string) {
    return this.httpClient.post(`message/${channelId}`, { text });
  }
}

import { Component, Input, signal } from '@angular/core';
import {
  Channel,
  DetailedServer,
  ServerService,
} from '../../services/server.service';
import { NgFor, NgIf } from '@angular/common';
import { ChannelsComponent } from '../../components/channels/channels.component';
import { MessagesComponent } from '../../components/messages/messages.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-server',
  standalone: true,
  imports: [NgIf, NgFor, ChannelsComponent, MessagesComponent],
  templateUrl: './server.component.html',
})
export class ServerComponent {
  constructor(private serverService: ServerService) {}
  private _serverId = signal('');

  @Input()
  set serverId(value: string) {
    this._serverId.set(value);
    this.updateServer();
  }

  get serverId() {
    return this._serverId();
  }

  server = signal<DetailedServer>({} as DetailedServer);
  channelSelected = signal<Channel | undefined>(undefined);

  onChannelSelect(channelId: number) {
    const channel = this.server()?.channels.find(
      (channel) => channel.id === channelId,
    );
    if (channel) this.channelSelected.set(channel);
  }

  serverListener: Subscription | undefined;
  updateServer() {
    if (!this.serverId) return;
    if (this.serverListener) this.serverListener.unsubscribe();
    this.serverService.getServerDetail(this.serverId).subscribe((response) => {
      this.server.set(response);
      this.serverListener = this.serverService
        .listenServer(response.id)
        .subscribe((event) => {
          if (event.type === 'created') {
            this.server.update((prev) => {
              prev?.channels.push(event.data);
              return prev;
            });
            return;
          }

          if (event.type === 'edited') {
            this.server.update((prev) => {
              if (!prev) return prev;
              const channelIdx = prev.channels.findIndex(
                (c) => c.id === event.data.id,
              );
              if (channelIdx === -1) return prev;
              prev.channels[channelIdx] = event.data;
              return prev;
            });
            return;
          }

          if (event.type === 'deleted') {
            this.server.update((prev) => {
              if (!prev) return prev;
              const channelIdx = prev.channels.findIndex(
                (c) => c.id === event.data.id,
              );
              if (channelIdx === -1) return prev;
              prev.channels.splice(channelIdx, 1);
              return prev;
            });
            return;
          }
        });
      this.channelSelected.set(response.channels?.at(0));
    });
  }
}

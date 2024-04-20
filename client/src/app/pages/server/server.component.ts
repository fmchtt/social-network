import { Component, Input, effect, signal } from '@angular/core';
import {
  Channel,
  DetailedServer,
  ServerService,
} from '../../services/server.service';
import { NgFor, NgIf } from '@angular/common';
import { ChannelsComponent } from '../../components/channels/channels.component';
import { MessagesComponent } from '../../components/messages/messages.component';

@Component({
  selector: 'app-server',
  standalone: true,
  imports: [NgIf, NgFor, ChannelsComponent, MessagesComponent],
  templateUrl: './server.component.html',
})
export class ServerComponent {
  constructor(private serverService: ServerService) {
    effect(() => {
      if (!this.serverId) return;
      this.serverService
        .getServerDetail(this.serverId)
        .subscribe((response) => {
          this.server.set(response);
          this.channelSelected.set(response.channels?.at(0));
        });
    });
  }
  private _serverId = signal('');

  @Input()
  set serverId(value: string) {
    this._serverId.set(value);
  }

  get serverId() {
    return this._serverId();
  }

  server = signal<DetailedServer | undefined>(undefined);
  channelSelected = signal<Channel | undefined>(undefined);

  onChannelSelect(channelId: number) {
    const channel = this.server()?.channels.find(
      (channel) => channel.id === channelId,
    );
    if (channel) this.channelSelected.set(channel);
  }

  onChannelCreated(channel: Channel) {
    this.server.update((prev) => {
      prev?.channels.push(channel);
      return prev;
    });
  }
}

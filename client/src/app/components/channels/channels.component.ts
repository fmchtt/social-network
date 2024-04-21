import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { Channel } from '../../services/server.service';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { ModalComponent } from '../modal/modal.component';
import { CreateChannelFormComponent } from '../forms/create-channel/create-channel.component';

@Component({
  selector: 'app-channels',
  standalone: true,
  imports: [NgFor, NgClass, NgIf, ModalComponent, CreateChannelFormComponent],
  templateUrl: './channels.component.html',
})
export class ChannelsComponent {
  constructor(public authService: AuthService) {}

  @Input() serverName: string = '';
  @Input() serverId: string = '';
  @Input() channels: Channel[] = [];
  @Input() selectedChannelId: number | undefined;

  @Output() onChannelSelect = new EventEmitter<number>();

  public createChannelModalOpen = signal(false);

  public onChannelClick(channelId: number) {
    this.onChannelSelect.emit(channelId);
  }

  public openCreateChannelModalOpen() {
    this.createChannelModalOpen.set(true);
  }

  public closeCreateChannelModalOpen() {
    this.createChannelModalOpen.set(false);
  }

  public handleCreatedChannel() {
    this.closeCreateChannelModalOpen();
  }
}

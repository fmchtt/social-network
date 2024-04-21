import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { Channel, DetailedServer } from '../../services/server.service';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { ModalComponent } from '../modal/modal.component';
import { CreateChannelFormComponent } from '../forms/create-channel/create-channel.component';
import { animate, style, transition, trigger } from '@angular/animations';
import { ChannelService } from '../../services/channel.service';

@Component({
  selector: 'app-channels',
  standalone: true,
  imports: [NgFor, NgClass, NgIf, ModalComponent, CreateChannelFormComponent],
  templateUrl: './channels.component.html',
  animations: [
    trigger('fade', [
      transition('void => *', [
        style({
          opacity: 0,
        }),
        animate(600, style({ opacity: 1 })),
      ]),
      transition('* => void', [
        style({
          opacity: 1,
        }),
        animate(600, style({ opacity: 0 })),
      ]),
    ]),
  ],
})
export class ChannelsComponent {
  constructor(
    public authService: AuthService,
    private channelService: ChannelService,
  ) {}

  @Input() server: DetailedServer = {} as DetailedServer;
  @Input() selectedChannelId: number | undefined;

  @Output() onChannelSelect = new EventEmitter<number>();

  public createChannelModalOpen = signal(false);
  public copied = signal(false);

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

  public deleteChannel(event: MouseEvent, channelId: number) {
    event.preventDefault();
    event.stopPropagation();
    this.channelService.deleteChannel(channelId).subscribe();
  }

  public copyIdentifierToClipboard() {
    if (this.copied()) return;
    window.navigator.clipboard.writeText(this.server.identifier);
    this.copied.set(true);
    setTimeout(() => {
      this.copied.set(false);
    }, 2000);
  }
}

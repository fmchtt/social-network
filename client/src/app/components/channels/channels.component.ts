import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { DetailedServer } from '../../services/server.service';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { ModalComponent } from '../modal/modal.component';
import { CreateChannelFormComponent } from '../forms/create-channel/create-channel.component';
import { ChannelService } from '../../services/channel.service';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroPlus, heroTrash } from '@ng-icons/heroicons/outline';
import { ChannelComponent } from './components/channel.component';

@Component({
  selector: 'app-channels',
  standalone: true,
  imports: [
    NgFor,
    NgClass,
    NgIf,
    ModalComponent,
    CreateChannelFormComponent,
    NgIconComponent,
    ChannelComponent,
  ],
  templateUrl: './channels.component.html',
  providers: [provideIcons({ heroTrash, heroPlus })],
})
export class ChannelsComponent {
  constructor(
    public authService: AuthService,
    private channelService: ChannelService
  ) {}

  @Input() server: DetailedServer = {} as DetailedServer;
  @Input() selectedChannelId: number | undefined;

  @Output() onChannelSelect = new EventEmitter<number>();

  public canEditChannels() {
    return this.authService.user()?.id === this.server.ownerId;
  }

  public quitClick() {
    this.authService.logout();
  }

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

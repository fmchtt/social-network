import { Component, Input } from '@angular/core';
import { Channel } from '../../services/server.service';
import { NgFor } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-channels',
  standalone: true,
  imports: [NgFor],
  templateUrl: './channels.component.html',
})
export class ChannelsComponent {
  constructor(public authService: AuthService) {}

  @Input() serverName: string = '';
  @Input() channels: Channel[] = [];
}

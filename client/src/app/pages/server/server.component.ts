import { Component, Input, OnInit, signal } from '@angular/core';
import { DetailedServer, ServerService } from '../../services/server.service';
import { NgFor, NgIf } from '@angular/common';
import { ChannelsComponent } from '../../components/channels/channels.component';

@Component({
  selector: 'app-server',
  standalone: true,
  imports: [NgIf, NgFor, ChannelsComponent],
  templateUrl: './server.component.html',
})
export class ServerComponent implements OnInit {
  constructor(private serverService: ServerService) {}

  @Input() serverId?: string;

  server = signal<DetailedServer | undefined>(undefined);

  ngOnInit(): void {
    if (this.serverId)
      this.serverService
        .getServerDetail(this.serverId)
        .subscribe((response) => this.server.set(response));
  }
}

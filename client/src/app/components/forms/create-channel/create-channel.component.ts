import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChannelService } from '../../../services/channel.service';
import { Channel } from '../../../services/server.service';

@Component({
  selector: 'app-create-channel-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './create-channel.component.html',
})
export class CreateChannelFormComponent {
  constructor(private channelService: ChannelService) {}

  @Output() createComplete = new EventEmitter<Channel>();
  @Input() serverId: string = '';

  name = signal('');

  handleNameChange(value: string) {
    this.name.set(value);
  }

  handleSubmit() {
    if (this.name() === '') return;
    this.channelService
      .createChannel(this.serverId, this.name())
      .subscribe((response) => {
        this.createComplete.emit(response);
      });
  }
}

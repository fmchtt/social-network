import { Component, Input, signal } from '@angular/core';
import { Message, MessageService } from '../../services/message.service';
import { Channel } from '../../services/server.service';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [FormsModule, NgFor, NgIf],
  templateUrl: './messages.component.html',
})
export class MessagesComponent {
  private _channel: Channel | undefined;

  @Input()
  set channel(value: Channel | undefined) {
    this._channel = value;
    this.updateMessages();
  }

  get channel(): Channel | undefined {
    return this._channel;
  }

  constructor(private messageService: MessageService) {}

  messages = signal<Message[]>([]);
  text = signal<string>('');

  updateMessages() {
    if (!this.channel) return;
    this.messageService.getMessages(this.channel.id).subscribe((response) => {
      this.messages.set(response.reverse());
    });
  }

  onMessageSubmit() {
    if (!this.channel?.id) return;
    this.messageService
      .sendMessage(this.channel.id, this.text())
      .subscribe(() => this.text.set(''));
  }

  parseDate(date: string) {
    return new Date(date).toLocaleDateString();
  }
}

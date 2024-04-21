import { Component, Input, signal } from '@angular/core';
import { Message, MessageService } from '../../services/message.service';
import { Channel } from '../../services/server.service';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { Subscription } from 'rxjs';

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

  private messageListener: Subscription | undefined;
  updateMessages() {
    if (!this.channel) return;
    if (this.messageListener) this.messageListener.unsubscribe();
    this.messageService.getMessages(this.channel.id).subscribe((response) => {
      this.messages.set(response.reverse());
    });
    this.messageListener = this.messageService
      .listenMessages(this.channel.id)
      .subscribe((response) => {
        if (response.type === 'created') {
          this.messages.update((prev) => {
            prev.unshift(response.data);
            return prev;
          });
          return;
        }

        if (response.type === 'edited') {
          this.messages.update((prev) => {
            const messageIdx = prev.findIndex((m) => m.id === response.data.id);
            if (messageIdx === -1) return prev;
            prev[messageIdx] = response.data;
            return prev;
          });
          return;
        }

        if (response.type === 'deleted') {
          this.messages.update((prev) => {
            const messageIdx = prev.findIndex((m) => m.id === response.data.id);
            if (messageIdx === -1) return prev;
            prev.splice(messageIdx, 1);
            return prev;
          });
          return;
        }
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

import { Component, Input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from '../../../services/message.service';
import { Channel } from '../../../services/server.service';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroCheck } from '@ng-icons/heroicons/outline';

@Component({
  selector: 'message-create-form',
  standalone: true,
  imports: [FormsModule, NgIconComponent],
  providers: [provideIcons({ heroCheck })],
  template: `
    <form class="h-16 flex gap-2 p-4 border-t" (submit)="onMessageSubmit()">
      <input
        type="text"
        class="rounded border-2 flex-1 p-2 placeholder:text-white"
        [ngModel]="text()"
        [ngModelOptions]="{ standalone: true }"
        (ngModelChange)="text.set($event)"
        placeholder="Type your message"
      />
      <button
        type="submit"
        class="rounded p-3 flex items-center justify-center cursor-pointer border-2"
      >
        <ng-icon name="heroCheck"></ng-icon>
      </button>
    </form>
  `,
})
export class CreateMessageComponent {
  private _channel: Channel | undefined;

  @Input()
  set channel(value: Channel | undefined) {
    this._channel = value;
  }

  get channel(): Channel | undefined {
    return this._channel;
  }

  constructor(private messageService: MessageService) {}

  text = signal<string>('');

  onMessageSubmit() {
    if (!this.channel?.id) return;
    if (this.text().trim() === '') return;
    this.messageService
      .sendMessage(this.channel.id, this.text())
      .subscribe(() => this.text.set(''));
  }
}

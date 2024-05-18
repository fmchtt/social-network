import { Component, Input, signal } from '@angular/core';
import { Message, MessageService } from '../../../services/message.service';
import { NgFor, NgIf } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroPencil, heroTrash } from '@ng-icons/heroicons/outline';

@Component({
  selector: 'messages-message',
  standalone: true,
  imports: [NgFor, NgIf, NgIconComponent],
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
  providers: [provideIcons({ heroTrash, heroPencil })],
  template: `
    <div
      @fade
      class="rounded-xl p-3 flex flex-col w-fit bg-primary text-white"
      (mouseenter)="toggleControls(true)"
      (mouseleave)="toggleControls(false)"
    >
      <div class="flex items-center gap-2">
        <span class="font-bold">{{ message.author.username }}</span>
        <span class="text-xs font-thin">{{
          parseDate(message.createdAt)
        }}</span>
        @if (canEdit && showControls()) {
        <div class="flex gap-1 items-center justify-center">
          <ng-icon
            class="cursor-pointer"
            name="heroPencil"
            (click)="updateMessage(message.id)"
          ></ng-icon>
          <ng-icon
            class="cursor-pointer"
            name="heroTrash"
            (click)="deleteMessage(message.id)"
          ></ng-icon>
        </div>
        }
      </div>
      <div>
        <p>{{ message.text }}</p>
      </div>
      @if (message.createdAt != message.updatedAt) {
      <span class="font-thin text-xs"> (edited)</span>
      }
    </div>
  `,
})
export class MessageComponent {
  constructor(private messageService: MessageService) {}

  public showControls = signal(false);

  @Input() message: Message = {} as Message;
  @Input() canEdit: boolean = false;

  parseDate(date: string) {
    return new Date(date).toLocaleDateString();
  }

  updateMessage(messageId: number) {}

  deleteMessage(messageId: number) {
    this.messageService.deleteMessage(messageId).subscribe();
  }

  toggleControls(state: boolean) {
    this.showControls.set(state);
  }
}

import { Component, Input, signal } from '@angular/core';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';
import { ChannelService } from '../../../services/channel.service';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroPencil, heroTrash } from '@ng-icons/heroicons/outline';
import { Channel } from '../../../services/server.service';

@Component({
  selector: 'channels-channel',
  standalone: true,
  imports: [NgFor, NgClass, NgIf, NgIconComponent],
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
      class="rounded p-2 flex justify-between items-center bg-opacity-10 hover:bg-opacity-10"
      [ngClass]="{
        'bg-secondary': selected,
        'cursor-pointer hover:bg-secondary': !selected
      }"
      (mouseenter)="toggleControls(true)"
      (mouseleave)="toggleControls(false)"
    >
      <span># {{ channel.name }}</span>
      @if (canEdit && showControls()) {
      <div class="flex gap-1 items-center justify-center">
        <ng-icon
          name="heroPencil"
          class="cursor-pointer"
          (click)="updateChannel($event)"
        ></ng-icon>
        <ng-icon
          name="heroTrash"
          class="cursor-pointer"
          (click)="deleteChannel($event, channel.id)"
        ></ng-icon>
      </div>
      }
    </div>
  `,
})
export class ChannelComponent {
  constructor(private channelService: ChannelService) {}

  public showControls = signal(false);

  @Input() channel: Channel = {} as Channel;
  @Input() selected: boolean = false;
  @Input() canEdit: boolean = false;

  public updateChannel(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  public deleteChannel(event: MouseEvent, channelId: number) {
    event.preventDefault();
    event.stopPropagation();
    this.channelService.deleteChannel(channelId).subscribe();
  }

  public toggleControls(state: boolean) {
    this.showControls.set(state);
  }
}

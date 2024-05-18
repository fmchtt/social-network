import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLinkActive } from '@angular/router';

@Component({
  selector: 'sidebar-cicle',
  standalone: true,
  imports: [RouterLinkActive, NgClass],
  template: `
    <div
      class="size-16 rounded-xl flex justify-center items-center cursor-pointer text-white bg-primary"
      [ngClass]="{ 'shadow-primary': !image }"
      routerLinkActive="bg-secondary"
    >
      {{ text }}
    </div>
  `,
})
export class CircleComponent {
  @Input() image? = '';
  @Input() text? = '';
}

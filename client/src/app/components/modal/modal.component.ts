import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [],
  templateUrl: './modal.component.html',
})
export class ModalComponent {
  @Input() title: string = '';
  @Output() closeModal = new EventEmitter();

  closeModalClick() {
    this.closeModal.emit();
  }
}

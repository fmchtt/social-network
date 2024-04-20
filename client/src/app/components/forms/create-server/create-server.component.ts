import { Component, EventEmitter, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ServerService } from '../../../services/server.service';

@Component({
  selector: 'app-create-server-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './create-server.component.html',
})
export class CreateServerFormComponent {
  constructor(private serverService: ServerService) {}

  name = signal('');

  @Output() createComplete = new EventEmitter();

  handleNameChange(value: string) {
    this.name.set(value);
  }

  handleSubmit() {
    if (this.name() === '') return;
    this.serverService.createServer(this.name()).subscribe();
    this.createComplete.emit();
  }
}

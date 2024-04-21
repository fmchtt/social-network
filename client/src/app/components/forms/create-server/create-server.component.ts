import { Component, EventEmitter, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ServerService } from '../../../services/server.service';
import { NgIf } from '@angular/common';
import { catchError, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-create-server-form',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './create-server.component.html',
})
export class CreateServerFormComponent {
  constructor(private serverService: ServerService) {}

  name = signal('');
  identifier = signal('');
  errorMessage = signal<string>('');
  mode = signal<'name' | 'identifier'>('name');

  @Output() createComplete = new EventEmitter();

  handleNameChange(value: string) {
    this.name.set(value);
  }

  handleIdentifierChange(value: string) {
    this.identifier.set(value);
  }

  handleMode(mode: 'name' | 'identifier') {
    this.mode.set(mode);
  }

  handleSubmit() {
    if (this.name() === '' && this.identifier() === '') return;

    if (this.name() !== '') {
      this.serverService
        .createServer(this.name())
        .pipe(
          catchError((err: HttpErrorResponse) => {
            this.errorMessage.set(err.error.message);
            return throwError(() => err);
          }),
        )
        .subscribe(() => {
          this.createComplete.emit();
        });
    }

    if (this.identifier() !== '') {
      this.serverService
        .connectServer(this.identifier())
        .pipe(
          catchError((err: HttpErrorResponse) => {
            if (err.status === 404) {
              this.errorMessage.set('Server not found');
            } else {
              this.errorMessage.set('Invalid identifier');
            }
            return throwError(() => err);
          }),
        )
        .subscribe(() => {
          this.createComplete.emit();
        });
    }
  }
}

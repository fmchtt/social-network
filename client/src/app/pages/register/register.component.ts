import { Component, signal } from '@angular/core';
import { AuthService, RegisterParams } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  registerParams = signal<RegisterParams>({
    username: '',
    password: '',
    name: '',
  });
  loading = signal(false);
  errorMessage = signal({} as { [key: string]: string });

  public register() {
    this.errorMessage.set({});

    if (!this.registerParams().username) {
      this.errorMessage.update((prev) => {
        prev['username'] = 'Username is required';
        return prev;
      });
      return;
    }

    if (!this.registerParams().password) {
      this.errorMessage.update((prev) => {
        prev['password'] = 'Password is required';
        return prev;
      });
      return;
    }
    this.loading.set(true);
    this.authService
      .register(this.registerParams())
      .pipe(
        catchError((err: HttpErrorResponse) => {
          this.errorMessage.set({ form: err.error.message });
          this.loading.set(false);
          return throwError(() => new Error(err.error.message));
        }),
      )
      .subscribe(() => {
        this.router.navigate(['home']);
      });
  }

  public onPasswordChange(value: string) {
    this.registerParams.update((prev) => {
      prev.password = value;
      return prev;
    });
  }

  public onUserNameChange(value: string) {
    this.registerParams.update((prev) => {
      prev.username = value;
      return prev;
    });
  }

  public onNameChange(value: string) {
    this.registerParams.update((prev) => {
      prev.name = value;
      return prev;
    });
  }
}

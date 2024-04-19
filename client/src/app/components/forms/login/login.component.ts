import { Component, signal } from '@angular/core';
import { AuthService, LoginParams } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'form-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
})
export class LoginFormComponent {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  loginParams = signal<LoginParams>({ username: '', password: '' });
  loading = signal(false);
  errorMessage = signal({} as { [key: string]: string });

  public login() {
    this.errorMessage.set({});

    if (!this.loginParams().username) {
      this.errorMessage.update((prev) => {
        prev['username'] = 'Username is required';
        return prev;
      });
      return;
    }

    if (!this.loginParams().password) {
      this.errorMessage.update((prev) => {
        prev['password'] = 'Password is required';
        return prev;
      });
      return;
    }
    this.loading.set(true);
    this.authService
      .login(this.loginParams())
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
    this.loginParams.update((prev) => {
      prev.password = value;
      return prev;
    });
  }

  public onUserNameChange(value: string) {
    this.loginParams.update((prev) => {
      prev.username = value;
      return prev;
    });
  }
}

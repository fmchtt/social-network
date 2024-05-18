import { HttpClient } from '@angular/common/http';
import { Injectable, effect, signal } from '@angular/core';
import { catchError, tap, throwError } from 'rxjs';

export type LoginParams = {
  username: string;
  password: string;
};

export type RegisterParams = {
  name: string;
} & LoginParams;

type AccessTokenResponse = {
  accessToken: string;
};

export type User = {
  id: number;
  name: string;
  username: string;
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private httpClient: HttpClient) {
    effect(() => this.updateUser());
  }

  authToken = signal(localStorage.getItem('accessToken'));
  user = signal<User | undefined>(undefined);

  public updateUser() {
    if (!this.authToken()) return;
    this.httpClient
      .get<User>('users/me')
      .pipe(
        catchError((err) => {
          this.authToken.set(null);
          localStorage.removeItem('accessToken');
          return throwError(() => err);
        })
      )
      .subscribe((response) => {
        this.user.set(response);
      });
  }

  public login(params: LoginParams) {
    return this.httpClient.post<AccessTokenResponse>('auth/login', params).pipe(
      tap((response) => {
        localStorage.setItem('accessToken', response.accessToken);
        this.authToken.set(response.accessToken);
      })
    );
  }

  public register(params: RegisterParams) {
    return this.httpClient
      .post<AccessTokenResponse>('auth/register', params)
      .pipe(
        tap((response) => {
          localStorage.setItem('accessToken', response.accessToken);
          this.authToken.set(response.accessToken);
        })
      );
  }

  public logout() {
    localStorage.removeItem('accessToken');
    this.authToken.set(null);
  }
}

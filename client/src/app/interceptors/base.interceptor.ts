import {
  HttpHeaders,
  HttpInterceptorFn,
  HttpResponse,
} from '@angular/common/http';
import { environment } from '../../environments/environment';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { tap } from 'rxjs';

export const baseInterceptor: HttpInterceptorFn = (req, next) => {
  const baseUrl = environment.BASE_URL || '/api';

  let headers: HttpHeaders = new HttpHeaders();
  const authService = inject(AuthService);
  const authToken = authService.authToken();
  if (authToken) {
    headers = headers.set('Authorization', `Bearer ${authToken}`);
  }

  const request = req.clone({ url: `${baseUrl}/${req.url}`, headers: headers });

  return next(request).pipe(
    tap((response) => {
      if (response instanceof HttpResponse && response.status === 401) {
        authService.logout();
      }
    })
  );
};

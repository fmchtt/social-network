import { HttpHeaders, HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const baseInterceptor: HttpInterceptorFn = (req, next) => {
  const baseUrl = environment.BASE_URL;

  let headers: HttpHeaders = new HttpHeaders();
  const authToken = inject(AuthService).authToken();
  if (authToken) {
    headers = headers.set('Authorization', `Bearer ${authToken}`);
  }

  const request = req.clone({ url: `${baseUrl}/${req.url}`, headers: headers });

  return next(request);
};

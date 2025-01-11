import { inject } from '@angular/core';
import {
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
  HttpInterceptorFn,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

export const jwtInterceptor: HttpInterceptorFn = (
  request: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const authService = inject(AuthService);
  const currentUser = authService.currentUserValue;
  if (currentUser && currentUser.token) {
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${currentUser.token}`,
      },
    });
  }

  return next(request).pipe(
    catchError((err) => {
      if (err.status === 401) {
        // Auto refresh token if 401 response returned from api
        return authService.refreshToken().pipe(
          switchMap(() => {
            const refreshedUser = authService.currentUserValue;
            if (refreshedUser && refreshedUser.token) {
              request = request.clone({
                setHeaders: {
                  Authorization: `Bearer ${refreshedUser.token}`,
                },
              });
            }
            return next(request);
          }),
          catchError((refreshErr) => {
            authService.logout();
            return throwError(() => refreshErr);
          })
        );
      }

      return throwError(() => err);
    })
  );
};

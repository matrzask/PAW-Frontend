import { inject } from '@angular/core';
import {
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
  HttpInterceptorFn,
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, switchMap, filter, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

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
        if (!isRefreshing) {
          isRefreshing = true;
          refreshTokenSubject.next(null);

          return authService.refreshToken().pipe(
            switchMap((token) => {
              isRefreshing = false;
              refreshTokenSubject.next(token);
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
              isRefreshing = false;
              authService.logout();
              return throwError(() => refreshErr);
            })
          );
        } else {
          return refreshTokenSubject.pipe(
            filter((token) => token !== null),
            take(1),
            switchMap((token) => {
              const refreshedUser = authService.currentUserValue;
              if (refreshedUser && refreshedUser.token) {
                request = request.clone({
                  setHeaders: {
                    Authorization: `Bearer ${refreshedUser.token}`,
                  },
                });
              }
              return next(request);
            })
          );
        }
      }

      return throwError(() => err);
    })
  );
};

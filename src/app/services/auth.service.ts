import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User } from '../model/user.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private path = 'http://localhost:3000/auth';
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<any>(
      JSON.parse(localStorage.getItem('currentUser')!)
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  login(email: string, password: string) {
    return this.http.post<any>(`${this.path}/login`, { email, password }).pipe(
      tap((response) => {
        const user = response.data.user;
        const token = response.data.token;
        const refreshToken = response.data.refreshToken;
        if (user && token && refreshToken) {
          localStorage.setItem(
            'currentUser',
            JSON.stringify({ user, token, refreshToken })
          );
          this.currentUserSubject.next({ user, token, refreshToken });
        }
        return response;
      })
    );
  }

  register(user: User, password: string) {
    return this.http
      .post<any>(`${this.path}/register`, { ...user, password })
      .pipe(
        tap((response) => {
          const user = response.data.user;
          const token = response.data.token;
          const refreshToken = response.data.refreshToken;
          if (user && token && refreshToken) {
            localStorage.setItem(
              'currentUser',
              JSON.stringify({ user, token, refreshToken })
            );
            this.currentUserSubject.next({ user, token, refreshToken });
          }
          return response;
        })
      );
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  refreshToken() {
    const currentUser = this.currentUserValue;
    return this.http
      .post<any>(`${this.path}/refresh-token`, {
        token: currentUser.refreshToken,
      })
      .pipe(
        tap((response) => {
          const token = response.data.token;
          const refreshToken = response.data.refreshToken;
          if (token && refreshToken) {
            const user = currentUser.user;
            localStorage.setItem(
              'currentUser',
              JSON.stringify({ user, token, refreshToken })
            );
            this.currentUserSubject.next({ user, token, refreshToken });
          }
          return response;
        })
      );
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.path}/users`);
  }

  addUser(user: User, password: string, specialty?: string): Observable<any> {
    return this.http.post<any>(`${this.path}/add-user`, {
      ...user,
      password,
      specialty,
    });
  }

  banUser(user: User): Observable<any> {
    return this.http.put<any>(`${this.path}/ban-user/${user.id}`, {});
  }

  unbanUser(user: User): Observable<any> {
    return this.http.put<any>(`${this.path}/unban-user/${user.id}`, {});
  }
}

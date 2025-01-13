import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../enums/user-role.enum';

@Injectable({
  providedIn: 'root',
})
export class RedirectGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const currentUser = this.authService.currentUserValue.user;
    if (currentUser) {
      if (currentUser.role === UserRole.Doctor) {
        this.router.navigate(['/calendar']);
      } else {
        this.router.navigate(['/doctor-list']);
      }
    } else {
      this.router.navigate(['/login']);
    }
    return false;
  }
}

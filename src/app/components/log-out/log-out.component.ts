import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { User } from '../../model/user.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'log-out',
  imports: [CommonModule],
  templateUrl: './log-out.component.html',
  styleUrl: './log-out.component.css',
})
export class LogOutComponent {
  constructor(private authService: AuthService, private router: Router) {}

  user?: User;

  ngOnInit() {
    this.user = this.authService.currentUserValue?.user;
  }

  logOut() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

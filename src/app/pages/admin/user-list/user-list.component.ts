import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { User } from '../../../model/user.interface';
import { AuthService } from '../../../services/auth.service';
import { RouterModule } from '@angular/router';
import { TopBarComponent } from '../../../components/top-bar/top-bar.component';

@Component({
  imports: [CommonModule, RouterModule, TopBarComponent],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css',
})
export class UserListComponent {
  constructor(private authService: AuthService) {}

  users: User[] = [];

  ngOnInit() {
    this.authService.getUsers().subscribe((users) => {
      this.users = users;
    });
  }

  banUser(user: User) {
    this.authService.banUser(user).subscribe(() => {
      user.banned = true;
    });
  }

  unbanUser(user: User) {
    this.authService.unbanUser(user).subscribe(() => {
      user.banned = false;
    });
  }
}

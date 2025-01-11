import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'login-buttons',
  imports: [],
  templateUrl: './login-buttons.component.html',
  styleUrl: './login-buttons.component.css',
})
export class LoginButtonsComponent {
  constructor(private router: Router) {}

  login() {
    this.router.navigate(['/login']);
  }

  register() {
    this.router.navigate(['/register']);
  }
}

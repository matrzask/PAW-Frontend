import { Component } from '@angular/core';
import { CalendarComponent } from '../../components/calendar/calendar.component';
import { CommonModule } from '@angular/common';
import { User } from '../../model/user.interface';
import { AuthService } from '../../services/auth.service';
import { RouterModule } from '@angular/router';
import { TopBarComponent } from '../../components/top-bar/top-bar.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.css'],
  imports: [CommonModule, CalendarComponent, RouterModule, TopBarComponent],
})
export class HomeComponent {
  constructor(private authService: AuthService) {}

  user?: User;

  ngOnInit() {
    this.user = this.authService.currentUserValue?.user;
  }
}

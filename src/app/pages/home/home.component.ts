import { Component } from '@angular/core';
import { CalendarComponent } from '../../components/calendar/calendar.component';
import { AddAvailabilityComponent } from '../../components/add-availability/add-availability.component';
import { AddAbsenceComponent } from '../../components/add-absence/add-absence.component';
import { SwitchDoctorComponent } from '../../components/switch-doctor/switch-doctor.component';
import { SwitchSourceComponent } from '../../components/switch-source/switch-source.component';
import { LogOutComponent } from '../../components/log-out/log-out.component';
import { CommonModule } from '@angular/common';
import { User } from '../../model/user.interface';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.css'],
  imports: [
    CommonModule,
    CalendarComponent,
    AddAvailabilityComponent,
    AddAbsenceComponent,
    SwitchSourceComponent,
    LogOutComponent,
    SwitchDoctorComponent,
  ],
})
export class HomeComponent {
  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.user = this.authService.currentUserValue.user;
  }

  user?: User;
}

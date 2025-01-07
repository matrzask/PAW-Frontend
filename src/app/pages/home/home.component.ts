import { Component } from '@angular/core';
import { CalendarComponent } from '../../components/calendar/calendar.component';
import { AddAvailabilityComponent } from '../../components/add-availability/add-availability.component';
import { AddAbsenceComponent } from '../../components/add-absence/add-absence.component';
import { SwitchDoctorComponent } from '../../components/switch-doctor/switch-doctor.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.css'],
  imports: [
    CalendarComponent,
    AddAvailabilityComponent,
    AddAbsenceComponent,
    SwitchDoctorComponent,
  ],
})
export class HomeComponent {}

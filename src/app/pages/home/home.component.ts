import { Component } from '@angular/core';
import { CalendarComponent } from '../../components/calendar/calendar.component';
import { AddAvailabilityComponent } from '../../components/add-availability/add-availability.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.css'],
  imports: [CalendarComponent, AddAvailabilityComponent],
})
export class HomeComponent {}

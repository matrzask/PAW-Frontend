import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AddAvailabilityComponent } from './add-availability/add-availability.component';
import { AddAbsenceComponent } from './add-absence/add-absence.component';

export const doctorRoutes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'availability', component: AddAvailabilityComponent },
  { path: 'absence', component: AddAbsenceComponent },
];

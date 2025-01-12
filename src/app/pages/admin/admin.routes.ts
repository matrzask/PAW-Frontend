import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserListComponent } from './user-list/user-list.component';
import { AddDoctorComponent } from './add-doctor/add-doctor.component';

export const adminRoutes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'user-list', component: UserListComponent },
  { path: 'add-doctor', component: AddDoctorComponent },
];

import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { adminRoutes } from './pages/admin/admin.routes';
import { GuestGuard } from './guards/guest.guard';
import { AdminGuard } from './guards/admin.guard';
import { DoctorListComponent } from './pages/doctor-list/doctor-list.component';
import { doctorRoutes } from './pages/doctor/doctor.routes';
import { DoctorGuard } from './guards/doctor.guard';
import { RedirectGuard } from './guards/redirect.guard';
import { ReviewsComponent } from './pages/reviews/reviews.component';

export const routes: Routes = [
  { path: '', canActivate: [RedirectGuard], pathMatch: 'full' },
  { path: 'calendar', component: HomeComponent },
  { path: 'login', component: LoginComponent, canActivate: [GuestGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [GuestGuard] },
  { path: 'admin', children: adminRoutes, canActivate: [AdminGuard] },
  { path: 'doctor-list', component: DoctorListComponent },
  { path: 'doctor', children: doctorRoutes, canActivate: [DoctorGuard] },
  { path: 'reviews/:id', component: ReviewsComponent },
];

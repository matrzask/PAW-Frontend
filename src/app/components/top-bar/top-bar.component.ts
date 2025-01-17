import { Component } from '@angular/core';
import { SwitchSourceComponent } from '../switch-source/switch-source.component';
import { LogOutComponent } from '../log-out/log-out.component';
import { LoginButtonsComponent } from '../login-buttons/login-buttons.component';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { User } from '../../model/user.interface';
import { RouterModule } from '@angular/router';
import { DoctorService } from '../../services/doctor.service';
import { UserRole } from '../../enums/user-role.enum';

@Component({
  selector: 'app-top-bar',
  imports: [
    CommonModule,
    SwitchSourceComponent,
    LogOutComponent,
    LoginButtonsComponent,
    RouterModule,
  ],
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.css',
})
export class TopBarComponent {
  constructor(
    private authService: AuthService,
    private doctorService: DoctorService
  ) {}

  user?: User;
  doctorId?: string;

  ngOnInit() {
    this.user = this.authService.currentUserValue?.user;
    if (this.user?.role === UserRole.Doctor) {
      this.doctorService
        .getDoctorByUserId(this.user.id!)
        .subscribe((doctor) => {
          this.doctorId = doctor.id;
        });
    }
  }
}

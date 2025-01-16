import { Component } from '@angular/core';
import { DoctorService } from '../../services/doctor.service';
import { ConfigService } from '../../services/config.service';
import { CommonModule } from '@angular/common';
import { Doctor } from '../../model/doctor.interface';
import { Router, RouterModule } from '@angular/router';
import { User } from '../../model/user.interface';
import { AuthService } from '../../services/auth.service';
import { TopBarComponent } from '../../components/top-bar/top-bar.component';

@Component({
  selector: 'app-doctor-list',
  imports: [CommonModule, RouterModule, TopBarComponent],
  templateUrl: './doctor-list.component.html',
  styleUrl: './doctor-list.component.css',
})
export class DoctorListComponent {
  constructor(
    private doctorService: DoctorService,
    private configService: ConfigService,
    private authService: AuthService,
    private router: Router
  ) {}

  doctors: Doctor[] = [];
  user?: User;

  ngOnInit() {
    this.doctorService.getDoctors().subscribe((doctors) => {
      this.doctors = doctors;
    });
    this.doctorService.subscribeForChange().subscribe((doctors) => {
      this.doctors = doctors;
    });
    this.user = this.authService.currentUserValue?.user;
  }

  selectDoctor(doctor: Doctor) {
    if (doctor.id) {
      this.configService.doctorId = doctor.id;
      this.router.navigate(['calendar']);
    }
  }
}

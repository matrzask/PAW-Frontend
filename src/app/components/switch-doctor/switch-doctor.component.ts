import { Component } from '@angular/core';
import { DoctorService } from '../../services/doctor.service';
import { ConfigService } from '../../services/config.service';
import { Doctor } from '../../model/doctor.interface';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'switch-doctor',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './switch-doctor.component.html',
  styleUrl: './switch-doctor.component.css',
})
export class SwitchDoctorComponent {
  constructor(
    private doctorService: DoctorService,
    private configService: ConfigService
  ) {}

  doctors: Doctor[] = [];

  selected: FormControl<string | null> = new FormControl<string | null>('');

  ngOnInit() {
    this.doctorService.getDoctors().subscribe((doctors) => {
      this.doctors = doctors;
    });

    this.selected.setValue(this.configService.doctorId);
  }

  onChange() {
    this.configService.doctorId = this.selected.value ?? '';
  }
}

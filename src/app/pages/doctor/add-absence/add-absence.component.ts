import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AbsenceService } from '../../../services/absence.service';
import { Absence } from '../../../model/absence.interface';
import { CommonModule } from '@angular/common';
import { TopBarComponent } from '../../../components/top-bar/top-bar.component';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-add-absence',
  imports: [ReactiveFormsModule, CommonModule, TopBarComponent, RouterModule],
  templateUrl: './add-absence.component.html',
  styleUrl: './add-absence.component.css',
})
export class AddAbsenceComponent {
  constructor(private absenceService: AbsenceService, private router: Router) {}

  form = new FormGroup({
    startDate: new FormControl<Date>(new Date(), Validators.required),
    endDate: new FormControl<Date>(new Date(), Validators.required),
  });

  mapFormValues(): Absence {
    return {
      startDate: this.form.value.startDate ?? new Date(),
      endDate: this.form.value.endDate ?? new Date(),
    };
  }

  addAbsence() {
    if (this.form.invalid) {
      return;
    }
    this.absenceService
      .addAbsence(this.mapFormValues())
      .subscribe((absence) => {
        console.log('Absence added:', absence);
      });
  }

  onSubmit() {
    this.addAbsence();
    this.router.navigate(['/doctor']);
  }
}

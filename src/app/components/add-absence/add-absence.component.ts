import { Component, Input } from '@angular/core';
import { AbsenceService } from '../../services/absence.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Absence } from '../../model/absence.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'add-absence',
  templateUrl: 'add-absence.component.html',
  styleUrls: ['add-absence.component.css'],
  imports: [CommonModule, ReactiveFormsModule],
})
export class AddAbsenceComponent {
  constructor(private absenceService: AbsenceService) {}

  form = new FormGroup({
    startDate: new FormControl<Date>(new Date(), Validators.required),
    endDate: new FormControl<Date>(new Date(), Validators.required),
  });

  formVisible: boolean = false;

  toggleForm() {
    this.formVisible = !this.formVisible;
  }

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
    this.formVisible = false;
    this.form.reset();
  }
}

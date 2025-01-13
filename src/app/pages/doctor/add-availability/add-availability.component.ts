import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AvailabilityService } from '../../../services/availability.service';
import { Availability } from '../../../model/availability.interface';
import { Router } from '@angular/router';
import { TopBarComponent } from '../../../components/top-bar/top-bar.component';

@Component({
  selector: 'app-add-availability',
  imports: [CommonModule, ReactiveFormsModule, TopBarComponent],
  templateUrl: './add-availability.component.html',
  styleUrl: './add-availability.component.css',
})
export class AddAvailabilityComponent {
  constructor(
    private availabilityService: AvailabilityService,
    private router: Router
  ) {}
  daysOfWeek: string[] = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];

  form = new FormGroup({
    oneTime: new FormControl<boolean>(false),
    startDate: new FormControl<Date>(new Date(), Validators.required),
    endDate: new FormControl(),
    daysOfWeek: new FormArray(
      this.daysOfWeek.map(() => new FormControl(false))
    ),
    times: new FormArray([]),
  });

  onDayChange(day: string, event: Event) {
    const checkbox = event.target as HTMLInputElement;
    const dayIndex = this.daysOfWeek.indexOf(day);
    if (dayIndex > -1) {
      (this.form.get('daysOfWeek') as FormArray)
        .at(dayIndex)
        .setValue(checkbox.checked);
    }
  }

  mapFormValues(): Availability {
    return {
      oneTime: this.form.value.oneTime ?? false,
      startDate: this.form.value.startDate ?? new Date(),
      endDate: this.form.value.endDate,
      daysOfWeek:
        this.form.value.daysOfWeek
          ?.map((selected, index) => (selected ? this.daysOfWeek[index] : null))
          .filter((day): day is string => day !== null) ?? [],
      times: this.form.value.times ?? [],
    };
  }

  addAvailability() {
    if (this.form.invalid) {
      return;
    }
    this.availabilityService
      .addAvailability(this.mapFormValues())
      .subscribe((availability) => {
        console.log('Availability added:', availability);
      });
  }

  get timesFormArray() {
    return this.form.get('times') as FormArray;
  }

  addTime() {
    this.timesFormArray.push(
      new FormGroup({
        start: new FormControl('08:00', Validators.required),
        end: new FormControl('16:00', Validators.required),
      })
    );
  }

  removeTime(index: number) {
    this.timesFormArray.removeAt(index);
  }

  onSubmit() {
    this.addAvailability();
    this.router.navigate(['/doctor']);
  }
}

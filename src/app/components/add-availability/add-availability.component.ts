import { Component, Input } from '@angular/core';
import { AvailabilityService } from '../../services/availability.service';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Availability } from '../../model/availability.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'add-availability',
  templateUrl: 'add-availability.component.html',
  styleUrls: ['add-availability.component.css'],
  imports: [CommonModule, ReactiveFormsModule],
})
export class AddAvailabilityComponent {
  constructor(private availabilityService: AvailabilityService) {}
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

  formVisible: boolean = false;

  toggleForm() {
    this.formVisible = !this.formVisible;
  }

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
        start: new FormControl('', Validators.required),
        end: new FormControl('', Validators.required),
      })
    );
  }

  removeTime(index: number) {
    this.timesFormArray.removeAt(index);
  }

  onSubmit() {
    this.addAvailability();
    this.formVisible = false;
    this.form.reset();
  }
}

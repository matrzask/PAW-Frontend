import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ConsultationType } from '../../enums/consultation-type.enum';
import { Gender } from '../../enums/gender.enum';

@Component({
  selector: 'reservation-pop-up',
  templateUrl: 'reservation-pop-up.component.html',
  styleUrls: ['reservation-pop-up.component.css'],
  imports: [CommonModule, DatePipe, ReactiveFormsModule],
})
export class ReservationPopUpComponent {
  @Input() visible = false;
  @Input() timeslotDate!: Date;
  @Input() maxDuration = 1;
  @Output() close = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<void>();

  doctorId: string = '1';

  genderOptions = Object.values(Gender);
  consultationTypeOptions = Object.values(ConsultationType);

  form = new FormGroup({
    duration: new FormControl<number>(30, Validators.required),
    type: new FormControl<ConsultationType>(
      ConsultationType.FirstConsultation,
      Validators.required
    ),
    patient: new FormControl<string>('', Validators.required),
    patientGender: new FormControl<Gender>(Gender.Male, Validators.required),
    patientAge: new FormControl<number>(0, Validators.required),
    details: new FormControl<string>(''),
  });

  onClose() {
    this.close.emit();
  }

  onSubmit() {
    this.confirm.emit();
  }

  onDurationChange(event: Event) {
    const input = (event.target as HTMLInputElement).value;
    let duration = parseInt(input, 10);
    if (duration % 30 !== 0) {
      duration = Math.ceil(duration / 30) * 30;
    }
    if (duration > this.maxDuration * 30) {
      duration = this.maxDuration * 30;
    }
    if (duration < 30) {
      duration = 30;
    }
    this.form.controls['duration'].setValue(duration);
  }
}

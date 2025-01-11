import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ConsultationType } from '../../enums/consultation-type.enum';
import { Gender } from '../../enums/gender.enum';
import { ConsultationService } from '../../services/consultation.service';
import { Consultation } from '../../model/consultation.interface';
import { AuthService } from '../../services/auth.service';
import { User } from '../../model/user.interface';

@Component({
  selector: 'reservation-pop-up',
  templateUrl: 'reservation-pop-up.component.html',
  styleUrls: ['reservation-pop-up.component.css'],
  imports: [CommonModule, DatePipe, ReactiveFormsModule],
})
export class ReservationPopUpComponent {
  constructor(
    private consultationService: ConsultationService,
    private authService: AuthService
  ) {}

  @Input() visible = false;
  @Input() timeslotDate!: Date;
  @Input() maxDuration = 1;
  @Output() close = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<void>();

  genderOptions = Object.values(Gender);
  consultationTypeOptions = Object.values(ConsultationType);

  form = new FormGroup({
    duration: new FormControl<number>(30, [
      Validators.required,
      Validators.min(30),
      Validators.max(this.maxDuration * 30),
    ]),
    type: new FormControl<ConsultationType>(
      ConsultationType.FirstConsultation,
      Validators.required
    ),
    patient: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    patientGender: new FormControl<Gender>(Gender.Male, Validators.required),
    patientAge: new FormControl<number>(0, Validators.required),
    details: new FormControl<string>(''),
  });

  user?: User;

  ngOnInit() {
    this.user = this.authService.currentUserValue.user;
    if (this.user) {
      this.form.controls['patient'].setValue(this.user.name);
      this.form.controls['patientGender'].setValue(this.user.gender);
      this.form.controls['patientAge'].setValue(this.user.age);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['maxDuration']) {
      this.updateDurationValidator();
    }
  }

  updateDurationValidator() {
    this.form.controls['duration'].setValidators([
      Validators.required,
      Validators.min(30),
      Validators.max(this.maxDuration * 30),
    ]);
    this.form.controls['duration'].updateValueAndValidity();
  }

  onClose() {
    this.close.emit();
  }

  mapFormValues(): Consultation {
    return {
      date: this.timeslotDate,
      duration: this.form.controls['duration'].value! / 30,
      type: this.form.controls['type'].value!,
      patient: this.form.controls['patient'].value ?? '',
      patientGender: this.form.controls['patientGender'].value!,
      patientAge: this.form.controls['patientAge'].value ?? 0,
      details: this.form.controls['details'].value ?? '',
    };
  }

  onSubmit() {
    if (this.form.invalid) {
      console.log(this.form.get('duration')?.value, this.maxDuration * 30);
      return;
    }
    this.consultationService
      .addConsultation(this.mapFormValues())
      .subscribe((consultation) => {
        console.log('Consultation added:', consultation);
      });
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

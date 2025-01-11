import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserRole } from '../../enums/user-role.enum';
import { Gender } from '../../enums/gender.enum';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  roles = Object.values(UserRole);
  genderOptions = Object.values(Gender);

  registerForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    name: new FormControl('', Validators.required),
    age: new FormControl('', Validators.required),
    gender: new FormControl<Gender>(Gender.Male, Validators.required),
    role: new FormControl<UserRole>(UserRole.Patient, Validators.required),
  });

  error: string | null = null;

  onSubmit() {
    console.log('form submitted');
  }
}

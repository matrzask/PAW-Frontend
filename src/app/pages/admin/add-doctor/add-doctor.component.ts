import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserRole } from '../../../enums/user-role.enum';
import { Gender } from '../../../enums/gender.enum';
import { User } from '../../../model/user.interface';
import { AuthService } from '../../../services/auth.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './add-doctor.component.html',
  styleUrl: './add-doctor.component.css',
})
export class AddDoctorComponent {
  constructor(private authService: AuthService, private router: Router) {}

  genderOptions = Object.values(Gender);

  registerForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
    name: new FormControl('', Validators.required),
    age: new FormControl<number>(18, Validators.required),
    gender: new FormControl<Gender>(Gender.Male, Validators.required),
  });

  error: string | null = null;

  formToUser(): User {
    return {
      email: this.registerForm.value.email!,
      name: this.registerForm.value.name ?? '',
      age: this.registerForm.value.age ?? 0,
      gender: this.registerForm.value.gender ?? Gender.PreferNotToSay,
      role: UserRole.Doctor,
      banned: false,
    };
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const user = this.formToUser();
      this.authService
        .addUser(user, this.registerForm.value.password!)
        .subscribe({
          next: () => {
            this.router.navigate(['/']);
          },
          error: (err) => {
            this.error = 'Registration failed';
          },
        });
    } else {
      this.error = 'Please fill in the form correctly';
    }
  }
}

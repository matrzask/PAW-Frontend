import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ReviewService } from '../../services/review.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../model/user.interface';

@Component({
  selector: 'app-review-pop-up',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './review-pop-up.component.html',
  styleUrl: './review-pop-up.component.css',
})
export class ReviewPopUpComponent {
  constructor(
    private reviewService: ReviewService,
    private authService: AuthService
  ) {}

  @Input() doctorId!: string;
  @Input() visible = false;
  @Output() close = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<void>();

  form: FormGroup = new FormGroup({
    rating: new FormControl<number>(3, [Validators.min(1), Validators.max(5)]),
    content: new FormControl(''),
  });

  user?: User;

  ngOnInit() {
    this.user = this.authService.currentUserValue?.user;
  }

  mapFormValues() {
    return {
      rating: this.form.get('rating')?.value,
      content: this.form.get('content')?.value,
      author: this.user?.name ?? '',
      doctorId: this.doctorId,
    };
  }

  onSubmit() {
    if (!this.form.valid) {
      return;
    }
    this.reviewService.addReview(this.mapFormValues()).subscribe((review) => {
      console.log('Review added:', review);
    });
    this.confirm.emit();
  }

  onClose() {
    this.close.emit();
  }
}

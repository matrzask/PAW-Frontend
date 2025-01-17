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
import { Review } from '../../model/review.interface';

@Component({
  selector: 'app-review-reply',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './review-reply.component.html',
  styleUrl: './review-reply.component.css',
})
export class ReviewReplyComponent {
  constructor(
    private reviewService: ReviewService,
    private authService: AuthService
  ) {}

  @Input() reviewId!: string;
  @Input() visible = false;
  @Output() close = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<void>();

  form: FormGroup = new FormGroup({
    reply: new FormControl(''),
  });

  user?: User;

  ngOnInit() {
    this.user = this.authService.currentUserValue?.user;
  }

  onSubmit() {
    if (!this.form.valid) {
      return;
    }
    let reply = this.form.get('reply')?.value;
    this.reviewService.addReply(this.reviewId, reply).subscribe((reply) => {
      console.log('Reply added:', reply);
    });
    this.confirm.emit();
  }

  onClose() {
    this.close.emit();
  }
}

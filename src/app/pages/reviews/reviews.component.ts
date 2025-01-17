import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReviewService } from '../../services/review.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TopBarComponent } from '../../components/top-bar/top-bar.component';
import { Doctor } from '../../model/doctor.interface';
import { DoctorService } from '../../services/doctor.service';
import { Review } from '../../model/review.interface';
import { User } from '../../model/user.interface';
import { AuthService } from '../../services/auth.service';
import { ReviewPopUpComponent } from '../../components/review-pop-up/review-pop-up.component';
import { ReviewReplyComponent } from '../../components/review-reply/review-reply.component';

@Component({
  selector: 'app-reviews',
  imports: [
    CommonModule,
    TopBarComponent,
    ReviewPopUpComponent,
    RouterModule,
    ReviewReplyComponent,
  ],
  templateUrl: './reviews.component.html',
  styleUrl: './reviews.component.css',
})
export class ReviewsComponent {
  constructor(
    private reviewService: ReviewService,
    private route: ActivatedRoute,
    private doctorService: DoctorService,
    private authService: AuthService
  ) {}

  reviews: Review[] = [];
  doctor?: Doctor;
  user?: User;

  showReviewPopup = false;
  showReplyPopup = false;
  selectedReviewId?: string;

  ngOnInit() {
    this.route.params.subscribe((params) => {
      let doctorId = params['id'];
      this.reviewService.getReviews(doctorId).subscribe((reviews) => {
        this.reviews = reviews;
      });
      this.doctorService.getDoctorById(doctorId).subscribe((doctor) => {
        this.doctor = doctor;
      });

      this.reviewService.subscribeForChange().subscribe((review) => {
        this.reviewService.getReviews(doctorId).subscribe((reviews) => {
          this.reviews = reviews;
        });
      });
    });
    this.user = this.authService.currentUserValue?.user;
  }

  deleteReview(reviewId: string) {
    this.reviewService.deleteReview(reviewId).subscribe(() => {
      console.log(`Review ${reviewId} deleted`);
    });
  }

  openReviewPopup() {
    this.showReviewPopup = true;
  }

  openReplyPopup(reviewId: string) {
    this.selectedReviewId = reviewId;
    this.showReplyPopup = true;
  }

  onClosePopup() {
    this.showReviewPopup = false;
    this.showReplyPopup = false;
    this.selectedReviewId = undefined;
  }
}

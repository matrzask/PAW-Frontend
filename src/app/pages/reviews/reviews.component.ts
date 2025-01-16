import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReviewService } from '../../services/review.service';
import { ActivatedRoute } from '@angular/router';
import { TopBarComponent } from '../../components/top-bar/top-bar.component';
import { Doctor } from '../../model/doctor.interface';
import { DoctorService } from '../../services/doctor.service';
import { Review } from '../../model/review.interface';
import { User } from '../../model/user.interface';
import { AuthService } from '../../services/auth.service';
import { ReviewPopUpComponent } from '../../components/review-pop-up/review-pop-up.component';

@Component({
  selector: 'app-reviews',
  imports: [CommonModule, TopBarComponent, ReviewPopUpComponent],
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

  openReviewPopup() {
    this.showReviewPopup = true;
  }

  onClosePopup() {
    this.showReviewPopup = false;
  }

  onConfirmReview() {
    this.showReviewPopup = false;
  }
}

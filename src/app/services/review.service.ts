import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { DataSource } from '../enums/data-source.enum';
import { HttpClient } from '@angular/common/http';
import { from, map, Subject } from 'rxjs';
import {
  addDoc,
  collection,
  collectionData,
  Firestore,
  query,
  where,
} from '@angular/fire/firestore';
import { Review } from '../model/review.interface';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  constructor(
    private configService: ConfigService,
    private http: HttpClient,
    private firestore: Firestore
  ) {}

  private reviewsChangedSubject = new Subject<Review[]>();

  readonly path = 'http://localhost:3000/review';

  getReviews(doctorId: string) {
    if (this.configService.source == DataSource.SERVER) {
      return this.http.get<Review[]>(`${this.path}?doctorId=${doctorId}`);
    } else if (this.configService.source == DataSource.FIREBASE) {
      const reviewsCollection = collection(this.firestore, 'review');
      const reviewsQuery = query(
        reviewsCollection,
        where('doctorId', '==', this.configService.doctorId)
      );
      return collectionData(reviewsQuery, { idField: 'id' }).pipe(
        map((reviews: any[]) =>
          reviews.map((reviews) => ({
            ...reviews,
          }))
        )
      );
    } else {
      throw new Error('Data source not supported');
    }
  }

  addReview(review: Review) {
    if (this.configService.source == DataSource.SERVER) {
      return this.http.post<Review>(this.path, review).pipe(
        map((data: any) => {
          this.getReviews(review.doctorId).subscribe((reviews) => {
            this.reviewsChangedSubject.next(reviews);
          });
          return data;
        })
      );
    } else if (this.configService.source == DataSource.FIREBASE) {
      const reviewsCollection = collection(this.firestore, 'review');
      return from(addDoc(reviewsCollection, review)).pipe(
        map(() => {
          this.getReviews(review.doctorId).subscribe((reviews) => {
            this.reviewsChangedSubject.next(reviews);
          });
        })
      );
    } else {
      throw new Error('Data source not supported');
    }
  }

  subscribeForChange() {
    return this.reviewsChangedSubject.asObservable();
  }
}

import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { DataSource } from '../enums/data-source.enum';
import { HttpClient } from '@angular/common/http';
import { from, map, Subject } from 'rxjs';
import {
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
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
  ) {
    this.configService.subscribeForChange().subscribe(() => {
      this.reviewsChangedSubject.next();
    });
  }

  private reviewsChangedSubject = new Subject<void>();

  getReviews(doctorId: string) {
    if (
      this.configService.source === DataSource.SERVER ||
      this.configService.source === DataSource.JSON
    ) {
      return this.http.get<Review[]>(
        `${this.configService.apiUrl}/review?doctorId=${doctorId}`
      );
    } else if (this.configService.source == DataSource.FIREBASE) {
      const reviewsCollection = collection(this.firestore, 'review');
      const reviewsQuery = query(
        reviewsCollection,
        where('doctorId', '==', doctorId)
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
    if (
      this.configService.source === DataSource.SERVER ||
      this.configService.source === DataSource.JSON
    ) {
      return this.http
        .post<Review>(this.configService.apiUrl + '/review', review)
        .pipe(
          map((data: any) => {
            this.reviewsChangedSubject.next();
            return data;
          })
        );
    } else if (this.configService.source == DataSource.FIREBASE) {
      const reviewsCollection = collection(this.firestore, 'review');
      return from(addDoc(reviewsCollection, review)).pipe(
        map(() => {
          this.reviewsChangedSubject.next();
        })
      );
    } else {
      throw new Error('Data source not supported');
    }
  }

  deleteReview(reviewId: string) {
    if (
      this.configService.source === DataSource.SERVER ||
      this.configService.source === DataSource.JSON
    ) {
      return this.http
        .delete(`${this.configService.apiUrl}/review/${reviewId}`)
        .pipe(
          map(() => {
            this.reviewsChangedSubject.next();
          })
        );
    } else if (this.configService.source == DataSource.FIREBASE) {
      const reviewDocRef = doc(this.firestore, 'review', reviewId);
      return from(deleteDoc(reviewDocRef)).pipe(
        map(() => {
          this.reviewsChangedSubject.next();
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

import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Availability } from '../model/availability.interface';
import { map } from 'rxjs/operators';
import { from, Observable, Subject } from 'rxjs';
import { ConfigService } from './config.service';
import {
  addDoc,
  collection,
  collectionData,
  Firestore,
  query,
  where,
} from '@angular/fire/firestore';
import { DataSource } from '../enums/data-source.enum';

@Injectable({
  providedIn: 'root',
})
export class AvailabilityService {
  private availabilityChangedSubject = new Subject<Availability[]>();

  private firestore = inject(Firestore);
  constructor(private http: HttpClient, private configService: ConfigService) {
    this.configService.subscribeForChange().subscribe(() => {
      this.getAvailability().subscribe((availabilities) =>
        this.availabilityChangedSubject.next(availabilities)
      );
    });
  }

  readonly path = 'http://localhost:3000/availability';

  getAvailability() {
    if (this.configService.source === DataSource.SERVER) {
      return this.http
        .get<Availability[]>(
          `${this.path}?doctorId=${this.configService.doctorId}`
        )
        .pipe(
          map((availabilities) =>
            availabilities.map((availability) => ({
              ...availability,
              startDate: new Date(availability.startDate),
              endDate: availability.endDate
                ? new Date(availability.endDate)
                : undefined,
            }))
          )
        );
    } else if (this.configService.source === DataSource.FIREBASE) {
      const availabilitiesCollection = collection(
        this.firestore,
        'availability'
      );
      const availabilitiesQuery = query(
        availabilitiesCollection,
        where('doctorId', '==', this.configService.doctorId)
      );
      return collectionData(availabilitiesQuery, { idField: 'id' }).pipe(
        map((availabilities: any[]) =>
          availabilities.map((availability) => ({
            ...availability,
            startDate: availability.startDate.toDate(),
            endDate: availability.endDate
              ? availability.endDate.toDate()
              : undefined,
          }))
        )
      );
    } else {
      throw new Error('Data source not supported');
    }
  }

  addAvailability(availability: Availability) {
    const formattedAvailability = {
      ...availability,
      startDate: new Date(availability.startDate),
      endDate: availability.endDate
        ? new Date(availability.endDate)
        : new Date(availability.startDate),
      times: availability.times.map((time) => ({
        start: time.start,
        end: time.end,
      })),
      doctorId: this.configService.doctorId,
    };

    if (this.configService.source === DataSource.SERVER) {
      return this.http
        .post<Availability>(this.path, formattedAvailability)
        .pipe(
          map(() => {
            this.getAvailability().subscribe((availabilities) =>
              this.availabilityChangedSubject.next(availabilities)
            );
          })
        );
    } else if (this.configService.source === DataSource.FIREBASE) {
      const availabilitiesCollection = collection(
        this.firestore,
        'availability'
      );
      return from(addDoc(availabilitiesCollection, formattedAvailability)).pipe(
        map(() => {
          this.getAvailability().subscribe((availabilities) =>
            this.availabilityChangedSubject.next(availabilities)
          );
        })
      );
    } else {
      throw new Error('Data source not supported');
    }
  }

  subscribeForChange(): Observable<Availability[]> {
    return this.availabilityChangedSubject.asObservable();
  }
}

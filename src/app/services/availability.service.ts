import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Availability } from '../model/availability.interface';
import { map } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { ConfigService } from './config.service';
import { doc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class AvailabilityService {
  private availabilityChangedSubject = new Subject<void>();

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.configService.subscribeForChange().subscribe(() => {
      this.availabilityChangedSubject.next();
    });
  }

  readonly path = 'http://localhost:3000/availability';

  getAvailability() {
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
  }

  addAvailability(availability: Availability) {
    const formattedAvailability = {
      ...availability,
      startDate: new Date(availability.startDate).toISOString(),
      endDate: availability.endDate
        ? new Date(availability.endDate).toISOString()
        : undefined,
      times: availability.times.map((time) => ({
        start: time.start,
        end: time.end,
      })),
      doctorId: this.configService.doctorId,
    };

    return this.http.post<Availability>(this.path, formattedAvailability).pipe(
      map(() => {
        this.availabilityChangedSubject.next();
      })
    );
  }

  subscribeForChange(): Observable<void> {
    return this.availabilityChangedSubject.asObservable();
  }
}

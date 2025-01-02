import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Availability } from '../model/availability.interface';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AvailabilityService {
  constructor(private http: HttpClient) {}

  readonly path = 'http://localhost:3000/availability';

  getAvailability(doctorId: number) {
    return this.http
      .get<Availability[]>(`${this.path}?doctorId=${doctorId}`)
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
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { Absence } from '../model/absence.interface';

@Injectable({
  providedIn: 'root',
})
export class AbsenceService {
  private absenceChangedSubject = new Subject<void>();

  constructor(private http: HttpClient) {}

  readonly path = 'http://localhost:3000/absence';

  getAbsence(doctorId: string) {
    return this.http.get<Absence[]>(`${this.path}?doctorId=${doctorId}`).pipe(
      map((absence) =>
        absence.map((absence) => ({
          ...absence,
          startDate: new Date(absence.startDate),
          endDate: absence.endDate ? new Date(absence.endDate) : undefined,
        }))
      )
    );
  }

  addAbsence(absence: Absence) {
    const formattedAvailability = {
      ...absence,
      startDate: new Date(absence.startDate).toISOString(),
      endDate: absence.endDate
        ? new Date(absence.endDate).toISOString()
        : undefined,
    };

    return this.http.post<Absence>(this.path, formattedAvailability).pipe(
      map(() => {
        this.absenceChangedSubject.next();
      })
    );
  }

  subscribeForChange(): Observable<void> {
    return this.absenceChangedSubject.asObservable();
  }
}

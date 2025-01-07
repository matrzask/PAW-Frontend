import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { Absence } from '../model/absence.interface';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root',
})
export class AbsenceService {
  private absenceChangedSubject = new Subject<void>();

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.configService.subscribeForChange().subscribe(() => {
      this.absenceChangedSubject.next();
    });
  }

  readonly path = 'http://localhost:3000/absence';

  getAbsences() {
    return this.http
      .get<Absence[]>(`${this.path}?doctorId=${this.configService.doctorId}`)
      .pipe(
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
      doctorId: this.configService.doctorId,
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

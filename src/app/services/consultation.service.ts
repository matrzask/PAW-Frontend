import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Consultation } from '../model/consultation.interface';
import { map } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConsultationService {
  private consultationChangedSubject = new Subject<void>();

  constructor(private http: HttpClient) {}

  readonly path = 'http://localhost:3000/consultation';

  getConsultations(doctorId: string) {
    return this.http
      .get<Consultation[]>(`${this.path}?doctorId=${doctorId}`)
      .pipe(
        map((availabilities) =>
          availabilities.map((consultation) => ({
            ...consultation,
            date: new Date(consultation.date),
          }))
        )
      );
  }

  addConsultation(consultation: Consultation) {
    const formattedConsultation = {
      ...consultation,
      date: new Date(consultation.date).toISOString(),
    };

    return this.http.post<Consultation>(this.path, formattedConsultation).pipe(
      map(() => {
        this.consultationChangedSubject.next();
      })
    );
  }

  subscribeForChange(): Observable<void> {
    return this.consultationChangedSubject.asObservable();
  }
}

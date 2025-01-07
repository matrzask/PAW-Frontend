import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Consultation } from '../model/consultation.interface';
import { map } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root',
})
export class ConsultationService {
  private consultationChangedSubject = new Subject<void>();

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.configService.subscribeForChange().subscribe(() => {
      this.consultationChangedSubject.next();
    });
  }

  readonly path = 'http://localhost:3000/consultation';

  getConsultations() {
    return this.http
      .get<Consultation[]>(
        `${this.path}?doctorId=${this.configService.doctorId}`
      )
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
      doctorId: this.configService.doctorId,
    };

    return this.http.post<Consultation>(this.path, formattedConsultation).pipe(
      map(() => {
        this.consultationChangedSubject.next();
      })
    );
  }

  deleteConsultation(consultationId: string) {
    return this.http.delete(`${this.path}/${consultationId}`).pipe(
      map(() => {
        this.consultationChangedSubject.next();
      })
    );
  }

  subscribeForChange(): Observable<void> {
    return this.consultationChangedSubject.asObservable();
  }
}

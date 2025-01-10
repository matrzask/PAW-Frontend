import { HttpClient } from '@angular/common/http';
import { inject, Inject, Injectable } from '@angular/core';
import { Consultation } from '../model/consultation.interface';
import { map } from 'rxjs/operators';
import { from, Observable, Subject } from 'rxjs';
import { ConfigService } from './config.service';
import { DataSource } from '../enums/data-source.enum';
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

@Injectable({
  providedIn: 'root',
})
export class ConsultationService {
  private consultationChangedSubject = new Subject<Consultation[]>();

  private firestore = inject(Firestore);
  constructor(private http: HttpClient, private configService: ConfigService) {
    this.configService.subscribeForChange().subscribe(() => {
      this.getConsultations().subscribe((consultations) => {
        this.consultationChangedSubject.next(consultations);
      });
    });
  }

  readonly path = 'http://localhost:3000/consultation';

  getConsultations() {
    if (this.configService.source === DataSource.SERVER) {
      return this.http
        .get<Consultation[]>(
          `${this.path}?doctorId=${this.configService.doctorId}`
        )
        .pipe(
          map((consultations) =>
            consultations.map((consultation) => ({
              ...consultation,
              date: new Date(consultation.date),
            }))
          )
        );
    } else if (this.configService.source === DataSource.FIREBASE) {
      const consultationsCollection = collection(
        this.firestore,
        'consultation'
      );
      const consultationsQuery = query(
        consultationsCollection,
        where('doctorId', '==', this.configService.doctorId)
      );
      return collectionData(consultationsQuery, { idField: 'id' }).pipe(
        map((consultations: any[]) =>
          consultations.map((consultation) => ({
            ...consultation,
            date: consultation['date'].toDate(),
          }))
        )
      );
    } else {
      throw new Error('Data source not supported');
    }
  }

  addConsultation(consultation: Consultation) {
    const formattedConsultation = {
      ...consultation,
      date: new Date(consultation.date),
      doctorId: this.configService.doctorId,
    };

    if (this.configService.source === DataSource.SERVER) {
      return this.http
        .post<Consultation>(this.path, formattedConsultation)
        .pipe(
          map(() => {
            this.getConsultations().subscribe((consultations) => {
              this.consultationChangedSubject.next(consultations);
            });
          })
        );
    } else if (this.configService.source === DataSource.FIREBASE) {
      const consultationsCollection = collection(
        this.firestore,
        'consultation'
      );
      return from(addDoc(consultationsCollection, formattedConsultation)).pipe(
        map(() => {
          this.getConsultations().subscribe((consultations) => {
            this.consultationChangedSubject.next(consultations);
          });
        })
      );
    } else {
      throw new Error('Data source not supported');
    }
  }

  deleteConsultation(consultationId: string) {
    if (this.configService.source === DataSource.SERVER) {
      return this.http.delete(`${this.path}/${consultationId}`).pipe(
        map(() => {
          this.getConsultations().subscribe((consultations) => {
            this.consultationChangedSubject.next(consultations);
          });
        })
      );
    } else if (this.configService.source === DataSource.FIREBASE) {
      const consultationDocRef = doc(
        this.firestore,
        `consultation/${consultationId}`
      );
      return from(deleteDoc(consultationDocRef)).pipe(
        map(() => {
          this.getConsultations().subscribe((consultations) => {
            this.consultationChangedSubject.next(consultations);
          });
        })
      );
    } else {
      throw new Error('Data source not supported');
    }
  }

  subscribeForChange(): Observable<Consultation[]> {
    return this.consultationChangedSubject.asObservable();
  }
}

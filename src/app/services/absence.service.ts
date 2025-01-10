import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { from, Observable, Subject } from 'rxjs';
import { Absence } from '../model/absence.interface';
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
export class AbsenceService {
  private absenceChangedSubject = new Subject<Absence[]>();

  private firestore = inject(Firestore);
  constructor(private http: HttpClient, private configService: ConfigService) {
    this.configService.subscribeForChange().subscribe(() => {
      this.getAbsences().subscribe((absences) =>
        this.absenceChangedSubject.next(absences)
      );
    });
  }

  readonly path = 'http://localhost:3000/absence';

  getAbsences() {
    if (this.configService.source === DataSource.SERVER) {
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
    } else if (this.configService.source === DataSource.FIREBASE) {
      const absencesCollection = collection(this.firestore, 'absence');
      const absencesQuery = query(
        absencesCollection,
        where('doctorId', '==', this.configService.doctorId)
      );
      return collectionData(absencesQuery, { idField: 'id' }).pipe(
        map((absence: any[]) =>
          absence.map((absence) => ({
            ...absence,
            startDate: absence.startDate.toDate(),
            endDate: absence.endDate ? absence.endDate.toDate() : undefined,
          }))
        )
      );
    } else {
      throw new Error('Data source not supported');
    }
  }

  addAbsence(absence: Absence) {
    const formattedAbsence = {
      ...absence,
      startDate: new Date(absence.startDate),
      endDate: absence.endDate
        ? new Date(absence.endDate)
        : new Date(absence.startDate),
      doctorId: this.configService.doctorId,
    };

    if (this.configService.source === DataSource.SERVER) {
      return this.http.post<Absence>(this.path, formattedAbsence).pipe(
        map(() => {
          this.getAbsences().subscribe((absences) =>
            this.absenceChangedSubject.next(absences)
          );
        })
      );
    } else if (this.configService.source === DataSource.FIREBASE) {
      const absencesCollection = collection(this.firestore, 'absence');
      return from(addDoc(absencesCollection, formattedAbsence)).pipe(
        map(() => {
          this.getAbsences().subscribe((absences) =>
            this.absenceChangedSubject.next(absences)
          );
        })
      );
    } else {
      throw new Error('Data source not supported');
    }
  }

  subscribeForChange(): Observable<Absence[]> {
    return this.absenceChangedSubject.asObservable();
  }
}

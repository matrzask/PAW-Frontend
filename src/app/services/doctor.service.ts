import { HttpClient } from '@angular/common/http';
import { ConfigService } from './config.service';
import { inject, Injectable } from '@angular/core';
import { Doctor } from '../model/doctor.interface';
import { from, map, Subject } from 'rxjs';
import { DataSource } from '../enums/data-source.enum';
import {
  addDoc,
  collection,
  collectionData,
  Firestore,
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class DoctorService {
  private firestore = inject(Firestore);
  constructor(private http: HttpClient, private configService: ConfigService) {
    this.configService.subscribeForChange().subscribe(() => {
      this.doctorsChangedSubject.next();
    });
  }

  private doctorsChangedSubject = new Subject<void>();

  readonly path = 'http://localhost:3000/doctor';

  getDoctors() {
    if (this.configService.source === DataSource.SERVER) {
      return this.http.get<Doctor[]>(this.path).pipe(
        map((doctors) => {
          if (this.configService.doctorId === '' && doctors.length > 0) {
            this.configService.doctorId = doctors[0].id ?? '';
          }
          return doctors;
        })
      );
    } else if (this.configService.source === DataSource.FIREBASE) {
      const doctorsCollection = collection(this.firestore, 'doctor');
      return collectionData(doctorsCollection, { idField: 'id' }).pipe(
        map((doctors: any[]) =>
          doctors.map((doctor) => ({
            ...doctor,
            id: doctor.id,
          }))
        )
      );
    } else {
      throw new Error('Data source not supported');
    }
  }

  getDoctorById(doctorId: string) {
    if (this.configService.source === DataSource.SERVER) {
      return this.http.get<Doctor>(`${this.path}/${doctorId}`);
    } else if (this.configService.source === DataSource.FIREBASE) {
      const doctorCollection = collection(this.firestore, 'doctor');
      return collectionData(doctorCollection, { idField: 'id' }).pipe(
        map((doctors: any[]) =>
          doctors.find((doctor) => doctor.id === doctorId)
        )
      );
    } else {
      throw new Error('Data source not supported');
    }
  }

  addDoctor(doctor: Doctor) {
    if (this.configService.source === DataSource.SERVER) {
      return this.http.post<Doctor>(this.path, doctor).pipe(
        map(() => {
          this.doctorsChangedSubject.next();
        })
      );
    } else if (this.configService.source === DataSource.FIREBASE) {
      const doctorsCollection = collection(this.firestore, 'doctor');
      return from(addDoc(doctorsCollection, doctor)).pipe(
        map(() => {
          this.doctorsChangedSubject.next();
        })
      );
    } else {
      throw new Error('Data source not supported');
    }
  }

  subscribeForChange() {
    return this.doctorsChangedSubject;
  }
}

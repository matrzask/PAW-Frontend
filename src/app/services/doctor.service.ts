import { HttpClient } from '@angular/common/http';
import { ConfigService } from './config.service';
import { inject, Injectable } from '@angular/core';
import { Doctor } from '../model/doctor.interface';
import { from, map, Observable, Subject } from 'rxjs';
import { DataSource } from '../enums/data-source.enum';
import {
  addDoc,
  collection,
  collectionData,
  Firestore,
} from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { UserRole } from '../enums/user-role.enum';

@Injectable({
  providedIn: 'root',
})
export class DoctorService {
  private firestore = inject(Firestore);
  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private authService: AuthService
  ) {
    this.configService.subscribeForChange().subscribe(() => {
      this.getDoctors().subscribe((doctors) => {
        this.updateDoctorId(doctors);
        this.doctorsChangedSubject.next(doctors);
      });
    });

    this.getDoctors().subscribe((doctors) => {
      this.updateDoctorId(doctors);
    });

    this.authService.currentUser.subscribe((user) => {
      if (user?.user?.role === UserRole.Doctor) {
        this.getDoctorByUserId(user.user.id).subscribe((doctor) => {
          if (doctor) {
            this.configService.doctorId = doctor.id;
          }
        });
      }
    });
  }

  private doctorsChangedSubject = new Subject<Doctor[]>();

  readonly path = 'http://localhost:3000/doctor';

  private updateDoctorId(doctors: Doctor[]) {
    if (
      doctors.length > 0 &&
      !doctors.some((doctor) => doctor.id === this.configService.doctorId)
    ) {
      if (doctors[0].id) {
        this.configService.doctorId = doctors[0].id;
      }
    }
  }

  getDoctors() {
    if (this.configService.source === DataSource.SERVER) {
      return this.http.get<Doctor[]>(this.path);
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

  getDoctorByUserId(userId: string) {
    if (this.configService.source === DataSource.SERVER) {
      return this.http.get<Doctor>(`${this.path}/${userId}`);
    } else if (this.configService.source === DataSource.FIREBASE) {
      const doctorCollection = collection(this.firestore, 'doctor');
      return collectionData(doctorCollection, { idField: 'id' }).pipe(
        map((doctors: any[]) =>
          doctors.find((doctor) => doctor.userId === userId)
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
          this.getDoctors().subscribe((doctors) => {
            this.doctorsChangedSubject.next(doctors);
          });
        })
      );
    } else if (this.configService.source === DataSource.FIREBASE) {
      const doctorsCollection = collection(this.firestore, 'doctor');
      return from(addDoc(doctorsCollection, doctor)).pipe(
        map(() => {
          this.getDoctors().subscribe((doctors) => {
            this.doctorsChangedSubject.next(doctors);
          });
        })
      );
    } else {
      throw new Error('Data source not supported');
    }
  }

  subscribeForChange(): Observable<Doctor[]> {
    return this.doctorsChangedSubject;
  }
}

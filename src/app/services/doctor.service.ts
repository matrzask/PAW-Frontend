import { HttpClient } from '@angular/common/http';
import { ConfigService } from './config.service';
import { Injectable } from '@angular/core';
import { Doctor } from '../model/doctor.interface';

@Injectable({
  providedIn: 'root',
})
export class DoctorService {
  constructor(private http: HttpClient, private configService: ConfigService) {}

  readonly path = 'http://localhost:3000/doctor';

  getDoctors() {
    return this.http.get<Doctor[]>(this.path);
  }

  getDoctorById(doctorId: string) {
    return this.http.get<Doctor>(`${this.path}/${doctorId}`);
  }
}

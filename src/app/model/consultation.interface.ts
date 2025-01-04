import { ConsultationType } from '../enums/consultation-type.enum';
import { Gender } from '../enums/gender.enum';

export interface Consultation {
  id?: string;
  doctorId: string;
  date: Date;
  duration: number; // in timeslots (half an hour each)
  type: ConsultationType;
  patient: string; // patient name and surname
  patientGender: Gender;
  patientAge: number;
  details?: string;
}

import { ConsultationType } from '../enums/consultation-type.enum';

export interface Consultation {
  id: string;
  doctorId: string;
  date: Date;
  duration: number; // in timeslots (half an hour each)
  type: ConsultationType;
  patient: string; // patient name and surname
  patientGender: string;
  patientAge: number;
  details?: string;
}

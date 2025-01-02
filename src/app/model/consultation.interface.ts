export interface Consultation {
  id: string;
  doctorId: string;
  date: Date;
  duration: number; // in timeslots (half an hour each)
  type: string; // type of consultation
  patient: string; // patient name and surname
  patientGender: string;
  patientAge: number;
  details?: string;
}

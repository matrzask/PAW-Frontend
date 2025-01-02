export interface Consultation {
  id: string;
  doctorId: string;
  date: string; // format YYYY-MM-DD
  time: string; // format HH:mm
  duration: number; // in hours
  type: string; // type of consultation
  patient: string; // patient name and surname
  patientGender: string;
  patientAge: number;
  details: string;
}

export interface Availability {
  id?: string;
  doctorId?: string;
  oneTime: boolean;
  startDate: Date;
  endDate?: Date;
  daysOfWeek?: string[];
  times: { start: string; end: string }[]; // e.g., [{start: '08:00', end: '9:00'}] includes 08:00, 08:30
}

export interface Availability {
  oneTime: boolean;
  startDate: Date;
  endDate?: Date;
  daysOfWeek?: string[];
  times?: { start: string; end: string }[]; // e.g., [{start: '08:00', end: '12:30'}]
}

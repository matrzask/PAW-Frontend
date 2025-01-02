import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { CalendarSlotComponent } from '../calendar-slot/calendar-slot.component';
import { Consultation } from '../../model/consultation.interface';

@Component({
  selector: 'app-calendar',
  templateUrl: 'calendar.component.html',
  styleUrl: 'calendar.component.css',
  imports: [CommonModule, CalendarSlotComponent],
})
export class CalendarComponent {
  @Input() doctorId!: number;

  @ViewChild('currentTimeslot', { static: false })
  currentTimeslotElement!: ElementRef;

  daysOfWeek: string[] = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];

  days: { date: Date; dayOfWeek: string }[] = [];

  timeslots: string[] = Array.from({ length: 48 }, (_, i) => {
    const hours = Math.floor(i / 2);
    const minutes = i % 2 === 0 ? '00' : '30';
    return `${hours.toString().padStart(2, '0')}:${minutes}`;
  });

  consultations: Consultation[] = [];

  ngOnInit() {
    const startOfWeek = this.getStartOfWeek(new Date());
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      this.days.push({ date, dayOfWeek: this.daysOfWeek[i] });
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.currentTimeslotElement) {
        this.currentTimeslotElement.nativeElement.scrollIntoView({
          behavior: 'instant',
          block: 'center',
        });
      }
    }, 0);
  }

  private getStartOfWeek(date: Date): Date {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    return new Date(date.setDate(diff));
  }

  isCurrentDay(date: Date): boolean {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }

  isCurrentTimeslot(timeslot: string): boolean {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const currentTimeslot = `${hours.toString().padStart(2, '0')}:${
      minutes < 30 ? '00' : '30'
    }`;
    return timeslot === currentTimeslot;
  }

  getConsultation(date: Date, timeslot: String): Consultation | undefined {
    return this.consultations.find(
      (c) =>
        c.date.getDate() === date.getDate() &&
        c.date.getMonth() === date.getMonth() &&
        c.date.getFullYear() === date.getFullYear() &&
        c.date.getHours() === parseInt(timeslot.slice(0, 2), 10) &&
        c.date.getMinutes() === parseInt(timeslot.slice(3), 10)
    );
  }

  getDateWithTimeslot(date: Date, timeslot: string): Date {
    const [hours, minutes] = timeslot.split(':').map((n) => parseInt(n, 10));
    const newDate = new Date(date);
    newDate.setHours(hours, minutes);
    return newDate;
  }
}

import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-calendar',
  templateUrl: 'calendar.component.html',
  styleUrl: 'calendar.component.css',
  imports: [CommonModule],
})
export class CalendarComponent {
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
}

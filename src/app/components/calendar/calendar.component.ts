import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { CalendarSlotComponent } from '../calendar-slot/calendar-slot.component';
import { Consultation } from '../../model/consultation.interface';
import { Availability } from '../../model/availability.interface';
import { AvailabilityService } from '../../services/availability.service';
import { AbsenceService } from '../../services/absence.service';
import { Absence } from '../../model/absence.interface';

@Component({
  selector: 'app-calendar',
  templateUrl: 'calendar.component.html',
  styleUrl: 'calendar.component.css',
  imports: [CommonModule, CalendarSlotComponent],
})
export class CalendarComponent {
  doctorId: string = '1';

  availability: Availability[] = [];

  @ViewChild('currentTimeslot', { static: false })
  currentTimeslotElement!: ElementRef;

  private timeslotsLoaded = false;

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

  times: string[] = [];

  consultations: Consultation[] = [];
  absences: Absence[] = [];
  absentDays: Set<number> = new Set();
  timeslots: Map<number, Consultation | undefined> = new Map();

  constructor(
    private availabilityService: AvailabilityService,
    private absenceService: AbsenceService
  ) {}

  ngOnInit() {
    const startOfWeek = this.getStartOfWeek(new Date());
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      date.setHours(0, 0, 0, 0);
      this.days.push({ date, dayOfWeek: this.daysOfWeek[i] });
    }

    this.getAbsences();
    this.absenceService.subscribeForChange().subscribe(() => {
      this.getAbsences();
    });

    this.fillSlots();
    this.availabilityService.subscribeForChange().subscribe(() => {
      this.fillSlots();
    });
  }

  changeWeek(weeks: number) {
    const startOfWeek = this.getStartOfWeek(this.days[0].date);
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i + weeks * 7);
      date.setHours(0, 0, 0, 0);
      this.days[i] = { date, dayOfWeek: this.daysOfWeek[i] };
    }
    this.fillSlots();
  }

  private getAbsences() {
    this.absenceService.getAbsence(this.doctorId).subscribe((data) => {
      this.absences = data;

      this.absentDays.clear();
      for (let absence of this.absences) {
        let startDate = new Date(absence.startDate);
        startDate.setHours(0, 0, 0, 0);
        let endDate = absence.endDate ? new Date(absence.endDate) : startDate;
        endDate.setHours(0, 0, 0, 0);
        while (startDate <= endDate) {
          this.absentDays.add(startDate.getTime());
          startDate.setDate(startDate.getDate() + 1);
        }
      }
    });
  }

  private fillSlots() {
    this.timeslots.clear();

    this.availabilityService
      .getAvailability(this.doctorId)
      .subscribe((data) => {
        this.availability = data;
        this.getTimeslots();
        this.setTimes();
      });
  }

  scrollToCurrentTime() {
    setTimeout(() => {
      if (this.currentTimeslotElement) {
        this.currentTimeslotElement.nativeElement.scrollIntoView({
          behavior: 'instant',
          block: 'center',
        });
      }
    }, 1);
  }

  private getStartOfWeek(date: Date): Date {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    return new Date(date.setDate(diff));
  }

  private getTimeslots() {
    for (let av of this.availability) {
      av.startDate.setHours(0, 0, 0, 0);
      if (av.endDate) av.endDate.setHours(23, 59, 59, 99);
      for (let day of this.days) {
        if (
          !av.oneTime &&
          av.daysOfWeek &&
          !av.daysOfWeek.includes(day.dayOfWeek)
        )
          continue;

        if (
          (day.date.getTime() === av.startDate.getTime() && av.oneTime) ||
          (!av.oneTime &&
            day.date >= av.startDate &&
            av.endDate &&
            day.date <= av.endDate)
        ) {
          for (let times of av.times) {
            let [startHours, startMinutes] = times.start.split(':').map(Number);
            let [endHours, endMinutes] = times.end.split(':').map(Number);
            let startTime = new Date(day.date);
            startTime.setHours(startHours, startMinutes, 0, 0);
            let endTime = new Date(day.date);
            endTime.setHours(endHours, endMinutes, 0, 0);

            while (startTime < endTime) {
              this.timeslots.set(
                startTime.getTime(),
                this.getConsultation(day.date, times.start)
              );
              startTime.setMinutes(startTime.getMinutes() + 30);
            }
          }
        }
      }
    }
    if (!this.timeslotsLoaded) {
      this.timeslotsLoaded = true;
      this.scrollToCurrentTime();
    }
  }

  private setTimes() {
    let earliestTime = '23:59';
    let latestTime = '00:00';

    for (let av of this.availability) {
      for (let times of av.times) {
        if (times.start < earliestTime) earliestTime = times.start;
        if (times.end > latestTime) latestTime = times.end;
      }
    }
    const [earliestHours, earliestMinutes] = earliestTime
      .split(':')
      .map(Number);
    const [latestHours, latestMinutes] = latestTime.split(':').map(Number);

    const startTime = new Date();
    startTime.setHours(earliestHours, earliestMinutes, 0, 0);

    const endTime = new Date();
    endTime.setHours(latestHours, latestMinutes, 0, 0);

    this.times = [];
    while (startTime < endTime) {
      const hours = startTime.getHours();
      const minutes = startTime.getMinutes();
      this.times.push(
        `${hours.toString().padStart(2, '0')}:${minutes
          .toString()
          .padStart(2, '0')}`
      );
      startTime.setMinutes(startTime.getMinutes() + 30);
    }
  }

  isCurrentDay(date: Date): boolean {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }

  isAbsent(date: Date): boolean {
    return this.absentDays.has(date.getTime());
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
    newDate.setHours(hours, minutes, 0, 0);
    return newDate;
  }

  maxTimeSlotDuration(timeslot: Date): number {
    let start = timeslot.getTime();
    let duration = 0;
    while (this.timeslots.has(start) && !this.timeslots.get(start)) {
      duration++;
      start += 30 * 60 * 1000;
    }
    return duration;
  }
}

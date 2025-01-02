import { Component, Input } from '@angular/core';
import { Consultation } from '../../model/consultation.interface';
import { CommonModule } from '@angular/common';
import { EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-calendar-slot',
  templateUrl: 'calendar-slot.component.html',
  styleUrls: ['calendar-slot.component.css'],
  imports: [CommonModule],
})
export class CalendarSlotComponent {
  @Input() timeslot!: { date: Date; consultation?: Consultation };
  @Input() cancelled = false;

  @Output() reserve = new EventEmitter<Date>();

  onReserve(): void {
    if (this.timeslot.date) {
      this.reserve.emit(this.timeslot.date);
    }
  }

  isReserved(): boolean {
    return !!this.timeslot.consultation;
  }

  isExpired(): boolean {
    return this.timeslot.date ? this.timeslot.date < new Date() : false;
  }

  getColor(): string {
    if (this.cancelled) {
      return 'red';
    }
    if (this.isExpired()) {
      return 'lightgray';
    }
    if (!this.isReserved()) {
      return 'lightblue';
    }

    switch (this.timeslot.consultation?.type) {
      case 'First Consultation':
        return 'green';
      case 'Follow-up':
        return 'blue';
      case 'Check-up':
        return 'orange';
      case 'Emergency':
        return 'red';
      case 'Other':
        return 'purple';
      default:
        return 'black';
    }
  }

  getText(): string {
    if (this.cancelled) {
      return 'Cancelled';
    }
    if (this.isReserved()) {
      return this.timeslot.consultation?.type ?? '';
    }
    if (this.isExpired()) {
      return 'Expired';
    }
    return 'Available';
  }
}

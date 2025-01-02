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
  @Input() consulation?: Consultation;
  @Input() date?: Date;
  @Input() cancelled = false;

  @Output() reserve = new EventEmitter<Date>();

  onReserve(): void {
    if (this.date) {
      this.reserve.emit(this.date);
    }
  }

  constructor() {
    if (!this.date) {
      this.date = this.consulation?.date ?? new Date(0);
    }
  }

  isReserved(): boolean {
    return !!this.consulation;
  }

  isExpired(): boolean {
    return this.date ? this.date < new Date() : false;
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

    switch (this.consulation?.type) {
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
    if (this.isExpired()) {
      return 'Expired';
    }
    if (this.isReserved()) {
      return this.consulation?.type ?? '';
    }
    return 'Available';
  }
}

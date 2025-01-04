import { Component, Input } from '@angular/core';
import { Consultation } from '../../model/consultation.interface';
import { CommonModule } from '@angular/common';
import { ReservationPopUpComponent } from '../reservation-pop-up/reservation-pop-up.component';

@Component({
  selector: 'app-calendar-slot',
  templateUrl: 'calendar-slot.component.html',
  styleUrls: ['calendar-slot.component.css'],
  imports: [CommonModule, ReservationPopUpComponent],
})
export class CalendarSlotComponent {
  @Input() timeslot!: { date: Date; consultation?: Consultation };
  @Input() cancelled = false;
  @Input() maxDuration = 1;

  showPopup = false;
  showTooltip = false;
  tooltipX = 0;
  tooltipY = 0;

  onReserve(): void {
    if (!this.isFree()) return;
    if (this.timeslot.date) {
      this.showPopup = true;
    }
  }

  onClosePopup() {
    this.showPopup = false;
  }

  onConfirmReservation() {
    this.showPopup = false;
  }

  isReserved(): boolean {
    return !!this.timeslot.consultation;
  }

  isExpired(): boolean {
    return this.timeslot.date ? this.timeslot.date < new Date() : false;
  }

  isFree(): boolean {
    return !this.isReserved() && !this.isExpired() && !this.cancelled;
  }

  getColor(): string {
    if (this.cancelled) {
      return 'lightcoral';
    }
    if (this.isExpired()) {
      return 'lightgray';
    }
    if (!this.isReserved()) {
      return 'lightblue';
    }

    switch (this.timeslot.consultation?.type) {
      case 'First Consultation':
        return 'lightgreen';
      case 'Follow-up':
        return 'Aquamarine';
      case 'Check-up':
        return 'orange';
      case 'Emergency':
        return 'red';
      case 'Other':
        return 'CadetBlue';
      default:
        return 'white';
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

  toggleTooltip(show: boolean, event: MouseEvent) {
    this.showTooltip = show;
    this.tooltipX = event.clientX;
    this.tooltipY = event.clientY;
  }
}

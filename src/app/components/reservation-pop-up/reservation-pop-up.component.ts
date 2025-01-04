import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'reservation-pop-up',
  templateUrl: 'reservation-pop-up.component.html',
  styleUrls: ['reservation-pop-up.component.css'],
  imports: [CommonModule, DatePipe],
})
export class ReservationPopUpComponent {
  @Input() visible = false;
  @Input() timeslotDate!: Date;
  @Output() close = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }

  onConfirm() {
    this.confirm.emit();
  }
}

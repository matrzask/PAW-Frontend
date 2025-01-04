import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Consultation } from '../../model/consultation.interface';
import { ConsultationService } from '../../services/consultation.service';

@Component({
  selector: 'cancel-consultation',
  templateUrl: 'cancel-consultation.component.html',
  styleUrls: ['cancel-consultation.component.css'],
  imports: [CommonModule],
})
export class CancelConsultationComponent {
  constructor(private consultationService: ConsultationService) {}

  @Input() visible = false;
  @Input() consultation!: Consultation;
  @Output() close = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }

  onConfirm() {
    if (this.consultation?.id) {
      this.consultationService
        .deleteConsultation(this.consultation.id)
        .subscribe(() => {
          console.log(`Consultation ${this.consultation.id} deleted`);
        });
    }
    this.confirm.emit();
  }
}

import { Component, Input } from '@angular/core';
import { doctorModel } from '../../../core/models/doctorModel';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BookingModalComponent } from '../booking-modal/booking-modal.component';

@Component({
  selector: 'app-doctor-card',
  standalone: false,
  templateUrl: './doctor-card.component.html',
  styleUrl: './doctor-card.component.css'
})
export class DoctorCardComponent {
  @Input() doctor!: doctorModel;

  constructor(private modalService: NgbModal) { }
  
  openBookingPopup(doctor: any) {
    const modalRef = this.modalService.open(BookingModalComponent, {
      centered: true,
      size: 'lg',
      backdrop: 'static'
    });
    modalRef.componentInstance.doctor = doctor;
  }
}

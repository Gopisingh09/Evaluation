import { Component } from '@angular/core';
import { AppointmentRequestModel } from '../../../core/models/appointmentModel';
import { AppointmentRequestService } from '../../../core/services/appointment-request.service';
import { SweetAlertService } from '../../../core/services/sweet-alert.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RescheduleModalComponent } from '../reschedule-modal/reschedule-modal.component';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-appointments-list',
  standalone: false,
  templateUrl: './appointments-list.component.html',
  styleUrl: './appointments-list.component.css'
})
export class AppointmentsListComponent {

  model: AppointmentRequestModel = new AppointmentRequestModel();

  constructor(private appointmentRequestService: AppointmentRequestService, private modalService: NgbModal, private sweetAlertService: SweetAlertService, private authService: AuthService) { }

  ngOnInit(): void {
    this.onSearch();
  }

  onSearch(): void {
    if (!this.isDateValid()) return;
    const user =  this.authService.getCurrentUser();
    if (user && user.Role === 'Doctor') {
      //debugger;
      this.model.DoctorId = user.DoctorId;
    } else {
      this.model.DoctorId = 0;
    }

    sessionStorage.setItem('doctorAppointmentsFilters', JSON.stringify(this.model));

    this.appointmentRequestService.appointmentGetList(this.model).subscribe({
      next: (data: any) => {
        this.model.appointmentRequestsList = data.AppointmentsList;
        this.model.totalRecords = data.TotalRecords;
        this.model.totalPages = data.TotalPages;
      },
      error: (err) => {
        console.error('Error fetching doctor appointments:', err);
      }
    });
  }

  reset(): void {
    this.model.searchByPatientName = '';
    this.model.fromDate = null;
    this.model.toDate = null;
    this.model.pageNumber = 1;
    this.model.pageSize = 4;
    this.onSearch();
  }

  onAccept(appointment: AppointmentRequestModel): void {
    this.sweetAlertService.showConfirm(
      'Are you sure?',
      'Do you want to accept this appointment?',
      'Yes, accept it'
    ).then((result: any) => {
      if (result.isConfirmed) {
        this.appointmentRequestService.accept(appointment).subscribe(() => {
          this.sweetAlertService.showSuccess('Appointment accepted successfully');
          this.onSearch();
        });
      }
    });
  }
 
  onReject(appointment: AppointmentRequestModel): void {
    this.sweetAlertService.showConfirm(
      'Are you sure?',
<<<<<<< HEAD
      'Do you want to reject this appointment request?',
=======
      'Do you really want to reject this appointment?',
>>>>>>> main
      'Yes, reject it'
    ).then((result: any) => {
      if (result.isConfirmed) {
        this.appointmentRequestService.reject(appointment).subscribe(() => {
          this.sweetAlertService.showSuccess('Appointment rejected successfully');
          this.onSearch();
        });
      }
    });
  }
 

  openRescheduleModal(appointmentId: number,patientemail:string, doctorId: number) {
    const modalRef = this.modalService.open(RescheduleModalComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.appointmentId = appointmentId;
    modalRef.componentInstance.patientEmail = patientemail;
    modalRef.componentInstance.doctorId = doctorId;
  }

   //  Validate from/to date
  isDateValid(): boolean {
    if (!this.model.fromDate || !this.model.toDate) return true;
    return new Date(this.model.fromDate) <= new Date(this.model.toDate);
  }
}



import { Component } from '@angular/core';
import { AppointmentRequestService } from '../../../core/services/appointment-request.service';
import { DoctorService } from '../../../core/services/doctor.service';
import { AppointmentRequestModel } from '../../../core/models/appointmentModel';

@Component({
  selector: 'app-appointments-list',
  standalone: false,
  templateUrl: './appointments-list.component.html',
  styleUrl: './appointments-list.component.css'
})
export class AppointmentsListComponent {

  model: AppointmentRequestModel = new AppointmentRequestModel();
  specializationList: any[] = [];

  constructor(
    private appointmentRequestService: AppointmentRequestService,
    private doctorService: DoctorService
  ) { }

  ngOnInit(): void {
    this.loadSpecializations(); // Load specialization dropdown
    this.onSearch();            // Initial fetch
  }

  //  Fetch appointment list
  onSearch(): void {
    if (!this.isDateValid()) return;

    const user = JSON.parse(localStorage.getItem('userInfo')!);
    this.model.DoctorId = user?.Role === 'Doctor' ? user.DoctorId : 0;
    this.appointmentRequestService.appointmentGetList(this.model).subscribe({
      next: (data: any) => {
        this.model.appointmentRequestsList = data.AppointmentsList;
        this.model.totalRecords = data.TotalRecords;
        this.model.totalPages = data.TotalPages;
      },
      error: (err) => console.error('Error fetching appointments', err)
    });
  }

  //  Load specializations for multi-select
  loadSpecializations(): void {
    this.doctorService.getAllDropdowns().subscribe((res: any) => {
      this.specializationList = res.Specializations;
    });
  }

  //  Reset filters
  reset(): void {
    this.model.searchByPatientName = '';
    this.model.searchByDoctorName = '';
    this.model.searchBySpecializationIds = [];
    this.model.fromDate = null;
    this.model.toDate = null;
    this.model.pageNumber = 1;
    this.model.pageSize = 4;
    this.onSearch();
  }

  //  Pagination controls
  incrementPageSize(): void {
    if (this.model.pageSize < 100) {
      this.model.pageSize++;
      this.onSearch();
    }
  }

  decrementPageSize(): void {
    if (this.model.pageSize > 1) {
      this.model.pageSize--;
      this.onSearch();
    }
  }

  //  Validate from/to date
  isDateValid(): boolean {
    if (!this.model.fromDate || !this.model.toDate) return true;
    return new Date(this.model.fromDate) <= new Date(this.model.toDate);
  }

}

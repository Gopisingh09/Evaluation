import { Component } from '@angular/core';
import { DoctorService } from '../../../core/services/doctor.service';
import { doctorModel } from '../../../core/models/doctorModel';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BookingModalComponent } from '../booking-modal/booking-modal.component';

@Component({
  selector: 'app-doctors-list',
  standalone: false,
  templateUrl: './doctors-list.component.html',
  styleUrls: ['./doctors-list.component.css']
})
export class DoctorsListComponent {
  doctors: doctorModel = new doctorModel();
  SpecializationList: any[] = [];
  GenderList: any[] = [];

  constructor(private doctorService: DoctorService, private modalService: NgbModal) { }

  ngOnInit() {
    this.loadDoctors(); // Load all doctors initially
    this.doctorService.getAllDropdowns().subscribe({
      next: (data: any) => {
        this.SpecializationList = data.Specializations;
        this.GenderList = data.Genders;
      },
      error: (err) => console.error('Failed to load specializations', err)
    });
  }

  loadDoctors() {
    this.doctorService.getDoctors(this.doctors).subscribe({
      next: (res: any) => {
        this.doctors.doctorsList = res.DoctorsList;
        this.doctors.totalRecords = res.TotalRecords;
        this.doctors.totalPages = res.TotalPages;
      },
      error: (err) => console.error('Failed to load doctors:', err)
    });
  }

}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DoctorService } from '../../../core/services/doctor.service';
import { SlotModel } from '../../../core/models/SlotModel';
import { AppointmentRequestModel } from '../../../core/models/appointmentModel';
import { AppointmentRequestService } from '../../../core/services/appointment-request.service';

import Swal from 'sweetalert2';
import { SweetAlertService } from '../../../core/services/sweet-alert.service';

@Component({
  selector: 'app-appointment-request',
  templateUrl: './appointment-request.component.html',
  styleUrls: ['./appointment-request.component.css'],
  standalone: false
})
export class AppointmentRequestComponent implements OnInit {

  doctorId!: number;
  slotId!: number;
  selectedSlot!: SlotModel;
  today: string = new Date().toISOString().split('T')[0];
  dobError: string = '';

  model: AppointmentRequestModel = new AppointmentRequestModel();
  GenderList: any[] = [];
  BloodGroupList: any[] = [];
  CountryList: any[] = [];
  StateList: any[] = [];
  TownList: any[] = [];


  uploadedReport: File;

  constructor(private route: ActivatedRoute, private router: Router, private sweetAlertService: SweetAlertService, private doctorService: DoctorService, private appointmentRequestService: AppointmentRequestService) { }

  ngOnInit(): void {
    // Reads slot info from state ()
    const state = history.state as { doctor?: any; slot?: SlotModel };

    if (state?.doctor && state?.slot) {
      // debugger;
      const doctor = state.doctor;
      const slot = state.slot;

      this.doctorId = doctor.id || doctor.DoctorId;
      this.slotId = slot.slotId;

      this.model.DoctorName = doctor.FirstName || doctor.DoctorName;
      this.model.DoctorEmail = doctor.Email || doctor.email;

      this.selectedSlot = {
        slotId: this.slotId,
        doctorId: this.doctorId,
        slotDate: slot.slotDate,
        startTime: slot.startTime,
        endTime: slot.endTime
      } as SlotModel;
    }

    this.appointmentRequestService.getAllDropdowns().subscribe({
      next: (res) => {
        this.GenderList = res.Genders;
        this.BloodGroupList = res.BloodGroups;
        this.CountryList = res.Countries;
      },
      error: (err) => {
        console.error('Error fetching dropdown data:', err);
      },
    });
  }

  validateDOB() {
    if (!this.model.DOB) {
      this.dobError = '';
      return;
    }

    const dob = new Date(this.model.DOB);
    const now = new Date();

    // Check for future DOB
    if (dob > now) {
      debugger;
      this.dobError = 'Date of birth cannot be in the future.';
      this.model.DOB = '';
      return;
    }

    // Check for age > 125 years
    const age = now.getFullYear() - dob.getFullYear();
    const monthDiff = now.getMonth() - dob.getMonth();
    const dayDiff = now.getDate() - dob.getDate();
    const adjustedAge = monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age;

    if (adjustedAge > 125) {
      this.dobError = 'Age cannot be greater than 125 years.';
      this.model.DOB = '';
      return;
    }

    this.dobError = '';
  }


  errorMessage(err: any) {
    Swal.fire({ text: err, confirmButtonColor: 'rgb(3, 142, 220)', });
  }


  onCountryChange() {
    this.StateList = [];
    this.TownList = [];
    if (this.model.CountryId) {
      this.appointmentRequestService.getStatesByCountry(this.model.CountryId).subscribe(res => {
        this.StateList = res;
      });
    }
  }

  onStateChange() {
    this.TownList = [];
    if (this.model.StateId) {
      this.appointmentRequestService.getTownsByState(this.model.StateId).subscribe(res => {
        this.TownList = res;
      });
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.uploadedReport = file;
    }
  }

  submit(appointmentForm: NgForm) {
    //debugger;
    if (appointmentForm.invalid) return;
    const dob = new Date(this.model.DOB);
    const now = new Date();

    // Check for future DOB
    if (dob > now) {
      debugger;
      this.dobError = 'Date of birth cannot be in the future.';
      this.model.DOB = '';
      return;
    }

    const appointmentData: AppointmentRequestModel = appointmentForm.value;
    appointmentData.DoctorId = this.doctorId;
    appointmentData.DoctorEmail = this.model.DoctorEmail;
    appointmentData.DoctorName = this.model.DoctorName;
    appointmentData.AppointmentDate = this.selectedSlot.slotDate;
    appointmentData.AppointmentStartTime = this.selectedSlot.startTime;
    appointmentData.AppointmentEndTime = this.selectedSlot.endTime;
    appointmentData.SlotId = this.slotId;

    this.appointmentRequestService.saveAppointmentRequest(appointmentData, this.uploadedReport).subscribe({
      next: () => {
        this.sweetAlertService.showSuccess('Appointment Submitted successfully!');
        this.router.navigate(['/']);
      },
      error: (err) => {
        if (err.status === 400 && err.error?.ModelState) {
          // Collect all validation errors
          const errors = Object.values(err.error.ModelState).flat();
          this.errorMessage(errors.join('\n'));
        } else if (err.status === 500) {
          this.errorMessage("Server error: " + (err.error.message || "Unexpected error"));
        } else {
          this.errorMessage(err.error?.message || "Unexpected error");
        }
      }
    });
  }

}

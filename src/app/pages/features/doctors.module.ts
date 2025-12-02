import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { DoctorsRoutingModule } from './doctors-routing.module';
import { DoctorsListComponent } from './doctors-list/doctors-list.component';
import { DoctorCardComponent } from './doctor-card/doctor-card.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BookingModalComponent } from './booking-modal/booking-modal.component';
import { AppointmentRequestComponent } from './appointment-request/appointment-request.component';
import { RescheduleModalComponent } from '../doctor/reschedule-modal/reschedule-modal.component';
import { AppointmentsListComponent } from '../doctor/appointments-list/appointments-list.component';



@NgModule({
  declarations: [
    DoctorsListComponent,
    DoctorCardComponent,
    BookingModalComponent,
    AppointmentRequestComponent,
    AppointmentsListComponent,
    RescheduleModalComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    DoctorsRoutingModule,
    NgSelectModule,
    NgbModule,ReactiveFormsModule
  ]
})
export class DoctorsModule { }

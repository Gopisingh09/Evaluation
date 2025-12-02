import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { AdminRoutingModule } from './admin-routing.module';
import { HomeComponent } from './home/home.component';
import { NgbModule, NgbPaginationModule, NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { AddeditDoctorComponent } from './addedit-doctor/addedit-doctor.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { HttpClientModule } from '@angular/common/http';
import { AppointmentsListComponent } from './appointments-list/appointments-list.component';


@NgModule({
  declarations: [
    HomeComponent,
    AddeditDoctorComponent,
    AppointmentsListComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    AdminRoutingModule,
    NgbPaginationModule,
    NgbToastModule,
    NgSelectModule,
    NgbModule,
    HttpClientModule,
  ]
})
export class AdminModule { }

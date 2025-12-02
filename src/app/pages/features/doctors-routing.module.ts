import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DoctorsListComponent } from './doctors-list/doctors-list.component';
import { AppointmentRequestComponent } from './appointment-request/appointment-request.component';
import { AuthGuard } from '../../core/guards/auth.guard';
import { RoleGuard } from '../../core/guards/role.guard';
import { AppointmentsListComponent } from '../doctor/appointments-list/appointments-list.component';

const routes: Routes = [
  {
    path: '',
    component: DoctorsListComponent
  },
  { path: 'appointment-request', component: AppointmentRequestComponent },
  { path: 'appointments-list', component: AppointmentsListComponent,canActivate:[AuthGuard,RoleGuard],data: { roles: ['Doctor'] }, },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DoctorsRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AddeditDoctorComponent } from './addedit-doctor/addedit-doctor.component';
import { AuthGuard } from '../../core/guards/auth.guard';
import { RoleGuard } from '../../core/guards/role.guard';
import { AppointmentsListComponent } from './appointments-list/appointments-list.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'addDoctor', component: AddeditDoctorComponent },
  { path: 'editDoctor/:id', component: AddeditDoctorComponent },
  { path: 'appointments-list', component: AppointmentsListComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }

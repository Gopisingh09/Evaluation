import { Component } from '@angular/core';
import { doctorModel } from '../../../core/models/doctorModel';
import { DoctorService } from '../../../core/services/doctor.service';
import { SweetAlertService } from '../../../core/services/sweet-alert.service';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  model : doctorModel = new doctorModel();
  showSuccessToast: boolean = false;

  constructor(private doctorService: DoctorService,private sweetAlertService:SweetAlertService) { 
    this.model.doctorsList = [];
  }

  ngOnInit(): void {
    this.model.pageSize = 4;
    this.onSearch();
}

onSearch():void{
  this.doctorService.getDoctors(this.model).subscribe({
    next:(res:any)=>{
      this.model.doctorsList = res.DoctorsList;
      this.model.totalRecords = res.TotalRecords;
    },
    error:(err:any)=>{this.sweetAlertService.showError(err?.error?.message || 'Failed to Load doctor')}
  });
}
}


import { Injectable } from '@angular/core';
import { AppointmentRequestModel } from '../models/appointmentModel';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { GlobalComponent } from '../../globalComponent';

const DROPDOWN_API = GlobalComponent.DROPDOWN_API;
const APPOINTMENT_API = GlobalComponent.APPOINTMENT_API;
const saveAppointmentRequest = GlobalComponent.saveAppointmentRequest;
const getAllDropdownsForAppointment = GlobalComponent.getAllDropdownsForAppointment;
const getStatesByCountry = GlobalComponent.getStatesByCountry;
const getTownsByState = GlobalComponent.getTownsByState;
const appointmentGetList = GlobalComponent.appointmentGetList;
const acceptAppointment = GlobalComponent.acceptAppointment;
const rejectAppointment = GlobalComponent.rejectAppointment;

@Injectable({
  providedIn: 'root'
})
export class AppointmentRequestService {



  constructor(private http: HttpClient) { }

  saveAppointmentRequest(appointmentData: AppointmentRequestModel, uploadedReport: File): Observable<any> {
    //debugger;
    const formData = new FormData();
    formData.append('model', JSON.stringify(appointmentData));
    if (uploadedReport) {
      formData.append('file', uploadedReport, uploadedReport.name);
    }
    return this.http.post(APPOINTMENT_API + saveAppointmentRequest, formData);
  }

  getAllDropdowns(): Observable<any> {
    return this.http.get<any>(DROPDOWN_API + getAllDropdownsForAppointment);
  }

  getStatesByCountry(countryId: number): Observable<any[]> {
    return this.http.get<any[]>(DROPDOWN_API + getStatesByCountry + `?countryId=${countryId}`);
  }

  getTownsByState(stateId: number): Observable<any[]> {
    return this.http.get<any[]>(DROPDOWN_API + getTownsByState + `?stateId=${stateId}`);
  }

  appointmentGetList(model: AppointmentRequestModel): Observable<any> {
    return this.http.post(APPOINTMENT_API + appointmentGetList, model);
  }

  accept(appointment: AppointmentRequestModel) {
    return this.http.post<any>(APPOINTMENT_API + acceptAppointment, appointment);
  }

  reject(appointment: AppointmentRequestModel) {
    //debugger;
    return this.http.post<any>(APPOINTMENT_API + rejectAppointment, appointment);
  }

}

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { doctorModel } from '../models/doctorModel';
import { SlotModel } from '../models/SlotModel';
import { GlobalComponent } from '../../globalComponent';

const DOCTOR_API = GlobalComponent.DOCTOR_API;
const APPOINTMENT_API = GlobalComponent.APPOINTMENT_API;
const getDoctors = GlobalComponent.getDoctors;
const getAvailableSlots = GlobalComponent.getAvailableSlots;
const getAllDropdowns = GlobalComponent.getAllDropdowns;
const createDoctor = GlobalComponent.createDoctor;
const getDoctorById = GlobalComponent.getDoctorById;
const DROPDOWN_API = GlobalComponent.DROPDOWN_API;

@Injectable({
  providedIn: 'root'
})
export class DoctorService {

  constructor(private http: HttpClient) { }

  getDoctors(model: doctorModel): Observable<doctorModel[]> {
    return this.http.post<doctorModel[]>(DOCTOR_API + getDoctors, model);
  }


  getAllDropdowns(): Observable<any> {
    return this.http.get<any>(DROPDOWN_API + getAllDropdowns);
  }


  getAvailableSlots(doctorId: number | string, startDate: Date, endDate: Date): Observable<SlotModel[]> {
    const params = new HttpParams()
      .set('doctorId', String(doctorId))
      .set('startDate', startDate.toISOString().slice(0, 10))
      .set('endDate', endDate.toISOString().slice(0, 10));

    return this.http.get<SlotModel[]>(DOCTOR_API + getAvailableSlots, { params });
  }

  createOrUpdateDoctorWithSchedule(payload: any) {
    return this.http.post(DOCTOR_API + createDoctor, payload);
  }

  rescheduleAppointment(requestId: number, patientEmail: string, slot: SlotModel) {
    return this.http.post(APPOINTMENT_API + `Reschedule`,
      { requestId, slotId: slot.slotId, email: patientEmail, newDate: slot.slotDate, newStartTime: slot.startTime, newEndTime: slot.endTime, });
  }

  getDoctorById(doctorId: number) {
    return this.http.get(DOCTOR_API + getDoctorById + `?id=${doctorId}`);
  }

}

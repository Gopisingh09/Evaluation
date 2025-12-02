import { specializationModel } from "./specializationModel";

export class AppointmentRequestModel {
  RequestId: number;
  PatientId: number;
  DoctorId: number;
  PatientName: string;
  DoctorName: string;
  DoctorEmail: string;
  AppointmentStartTime: string;
  AppointmentEndTime: string;
  AppointmentDate: string;
  FirstName: string;
  LastName: string;
  GenderId: number;
  BloodGroupId: number;
  DOB: string;
  Email: string;
  PhoneNumber: string;
  CountryId: number;
  StateId: number
  TownId: number;
  Area: string;
  InsuranceProvider?: string;
  InsurancePolicyNumber?: string;
  MedicalHistory?: string;
  MedicalConcerns: string;
  Reports?: File[];

  IsActive: boolean;
  CreatedBy: number;
  CreatedOn: Date;
  ModifiedBy: number;
  ModifiedOn: Date;

  SlotId: number;

  sortColumn: string;
  sortDirection: string;

  totalPages: number;
  totalRecords: number;

  pageNumber: number = 1;
  pageSize: number = 4;

  SpecializationName: string;
  searchByPatientName: string;
  searchByDoctorName: string;
  searchBySpecializationIds: string[];
  fromDate: null;
  toDate: null;

  RequestStatusName: string;
  specializationId: number;

  specializationList: specializationModel[];
  appointmentRequestsList: AppointmentRequestModel[] = [];
  DocumentUrl:string;
}


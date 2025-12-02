
export class doctorModel{

    DoctorId: number;
    UserId: number;
    FirstName: string;
    LastName: string;
    Username: string;
    Password: string;
    Email: string;
    Gender: string;
    GenderId: number;
    DOB: string;
    SpecializationId: number ;
    SpecializationName: string;
    QualificationName: string;
    GenderName: string;
    QualificationId: number;
    YearsOfExperience: number;
    ConsultationFee: number;
    Bio:string;
    IsActive:boolean;
    CreatedBy:number;
    CreatedOn:Date;
    ModifiedBy:number;
    ModifiedOn:Date;

    totalPages: number;
    totalRecords: number;
    pageSize: number=4;
    pageNumber: number=1;

    doctorsList : doctorModel[];
}




import { create } from "node:domain";
import { get } from "node:http";

export const GlobalComponent = {
    API_URL:'',
    headerToken:{'Authorization': 'Bearer '+localStorage.getItem('token')},

    //Auth API
    AUTH_API:'http://localhost:23027/api/Auth/',
    
    login :'Login',
    validateToken :'validate',
    

    //Doctor API
    DOCTOR_API:'http://localhost:23027/api/Doctors/',

    getDoctors:'DoctorsGetList',
    getDoctorById:'GetDoctorId',
    createDoctor:'CreateDoctor',
    getAvailableSlots:'GetAvailable',

    //Dropdown API
    DROPDOWN_API:'http://localhost:23027/api/Dropdowns/',

    getAllDropdowns:'GetDropdownDataForDoctorForm',
    getAllDropdownsForAppointment:'GetDropdownDataForAppointmentForm',
    getStatesByCountry:'GetStatesByCountry',
    getTownsByState:'GetTownsByState',

    //Appointment API
    APPOINTMENT_API:'http://localhost:23027/api/Appointments/',

    saveAppointmentRequest:'SaveAppointmentRequest',
    appointmentGetList:'AppointmentGetList',
    acceptAppointment:'AcceptAppointment',
    rejectAppointment:'RejectAppointment',
};
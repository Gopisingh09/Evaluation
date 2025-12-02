import { Injectable } from '@angular/core';


import Swal from 'sweetalert2';
@Injectable({
  providedIn: 'root'
})

export class SweetAlertService {

  constructor() { }
  showSuccess(message: string, title: string = 'Success!') {
    return Swal.fire({
      icon: 'success',
      title: title,
      text: message,
      confirmButtonText: 'Okay',
      confirmButtonColor: '#3085d6',
      background: '#f5f5f5'
    });
  }

  showError(message: string, title: string = 'Error!') {
    return Swal.fire({
      icon: 'error',
      title: title,
      text: message,
      confirmButtonText: 'Try Again',
      confirmButtonColor: '#d33',
      background: '#f8d7da'
    });

  }

  alertMessage(msg: string) {
    Swal.fire({ text: msg, confirmButtonColor: 'rgb(3,142,220)' });
  }

}

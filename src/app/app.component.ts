import { Component } from '@angular/core';
import { LoaderService } from './core/helpers/loader/loader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'DoctorsAppointmentPortal';

  constructor(public loader: LoaderService) {}
}

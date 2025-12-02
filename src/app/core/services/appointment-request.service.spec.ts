import { TestBed } from '@angular/core/testing';

import { AppointmentRequestService } from './appointment-request.service';

describe('AppointmentRequestService', () => {
  let service: AppointmentRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppointmentRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

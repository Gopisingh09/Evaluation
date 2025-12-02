import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddeditDoctorComponent } from './addedit-doctor.component';

describe('AddeditDoctorComponent', () => {
  let component: AddeditDoctorComponent;
  let fixture: ComponentFixture<AddeditDoctorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddeditDoctorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddeditDoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

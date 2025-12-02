import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { doctorModel } from '../../../core/models/doctorModel';
import { SlotModel } from '../../../core/models/SlotModel';
import { DoctorService } from '../../../core/services/doctor.service';
import Swal from 'sweetalert2';
import { SweetAlertService } from '../../../core/services/sweet-alert.service';

@Component({
  selector: 'app-addedit-doctor',
  standalone: false,
  templateUrl: './addedit-doctor.component.html',
  styleUrl: './addedit-doctor.component.css'
})
export class AddeditDoctorComponent implements OnInit {
  model: doctorModel = new doctorModel();
  slotModel: SlotModel = new SlotModel();
  isEditMode = false;
  doctorId: number = 0;
  ageError: string = '';
  experienceError: string = '';
  SpecializationList: any[] = [];
  GenderList: any[] = [];
  QualificationList: any[] = [];

  weekDays: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  dayTimes: any = {};
  slotErrors: { [day: string]: string } = {};

  minAgeByQualification: any = {
    MBBS: 24,
    MD: 27,
    MS: 27
  };


  private initialDoctorState: any;

  constructor(
    private doctorService: DoctorService,
    private route: ActivatedRoute,
    private router: Router, private sweetAlertService: SweetAlertService
  ) { }

  ngOnInit(): void {
    // Initialize empty day time slots
    this.weekDays.forEach(day => this.dayTimes[day] = []);

    // Load dropdowns
    this.doctorService.getAllDropdowns().subscribe({
      next: (data: any) => {
        this.SpecializationList = data.Specializations;
        this.GenderList = data.Genders;
        this.QualificationList = data.Qualifications;
      },
      error: (err) => console.error('Failed to load dropdowns', err)
    });

    // Determine if edit mode
    const id = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!id;
    if (this.isEditMode && id) {
      this.doctorId = +id;
      this.loadDoctorDetails(this.doctorId);
    }
  }

  //  Load doctor details when editing
  loadDoctorDetails(doctorId: number): void {
    this.doctorService.getDoctorById(+doctorId).subscribe({
      next: (res: any) => {
        this.model = res;
        console.log('Doctor Details:', res);

        this.slotModel.SlotDuration = res.SlotDuration;

        // Reset dayTimes
        this.weekDays.forEach(day => this.dayTimes[day] = []);

        if (res.WeeklySchedule && res.WeeklySchedule.length > 0) {
          const numberToDayMap: { [key: number]: string } = {
            0: 'Sunday',
            1: 'Monday',
            2: 'Tuesday',
            3: 'Wednesday',
            4: 'Thursday',
            5: 'Friday',
            6: 'Saturday'
          };

          res.WeeklySchedule.forEach((slot: any) => {
            const dayName = numberToDayMap[slot.DayOfWeek];
            if (dayName) {
              this.dayTimes[dayName].push({
                startTime: slot.StartTime,
                endTime: slot.EndTime
              });
            }
          });
        }
      },
      error: (err) => console.error('Failed to load doctor details', err)
    });
  }


  addTimeRange(day: string) {
    this.dayTimes[day].push({ startTime: '', endTime: '' });
    this.validateDaySlots(day);
  }

  removeTimeRange(day: string, index: number) {
    this.dayTimes[day].splice(index, 1);
    this.validateDaySlots(day);
  }

  onSlotDurationChange() {
    this.weekDays.forEach(day => this.validateDaySlots(day));
  }

  calculateAge(dob: string): number {
    const birthDate = new Date(dob);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }

    return age;
  }


  validateAgeBasedOnQualification() {
    const selectedQual = this.QualificationList.find(
      q => q.QualificationId === this.model.QualificationId
    );

    if (!selectedQual || !this.model.DOB) {
      this.ageError = '';
      return;
    }

    const qualName = selectedQual.QualificationName;
    const minAge = this.minAgeByQualification[qualName];
    const calculatedAge = this.calculateAge(this.model.DOB);

    if (minAge && calculatedAge < minAge) {
      this.ageError = `Minimum age for ${qualName} is ${minAge} years. Current age: ${calculatedAge}.`;
    } else {
      this.ageError = '';
    }

    const maxExperience = calculatedAge - minAge;
    if (this.model.YearsOfExperience > maxExperience) {
      this.experienceError = `Maximum experience allowed for ${qualName} at age ${calculatedAge} is ${maxExperience} years.`;
    } else {
      this.experienceError = '';
    }

  }


  validateDaySlots(day: string) {
    const slots = this.dayTimes[day];
    this.slotErrors[day] = '';

    if (!slots || slots.length === 0) return;

    // Ensure slot duration is entered first
    const slotDuration = this.slotModel.SlotDuration;
    if (!slotDuration || slotDuration <= 0) {
      this.slotErrors[day] = 'Please enter slot duration before adding slots.';
      return;
    }

    // Convert to numeric minutes for comparison
    const normalized = slots
      .filter((s: any) => s.startTime && s.endTime)
      .map((s: any) => ({
        start: this.timeToMinutes(s.startTime),
        end: this.timeToMinutes(s.endTime)
      }));

    // Check start < end and duration >= slotDuration
    for (const { start, end } of normalized) {
      if (start >= end) {
        this.slotErrors[day] = 'Start time must be earlier than end time.';
        return;
      }
      const diff = end - start;
      if (diff < slotDuration) {
        this.slotErrors[day] = `Each time range must be at least ${slotDuration} minutes.`;
        return;
      }
    }

    // Sort slots by start time
    normalized.sort((a: { start: number; end: number }, b: { start: number; end: number }) => a.start - b.start);

    // Check for overlaps
    for (let i = 0; i < normalized.length - 1; i++) {
      const current = normalized[i];
      const next = normalized[i + 1];
      if (next.start < current.end) {
        this.slotErrors[day] = 'Overlapping or duplicate time slots detected.';
        return;
      }
    }

    // No errors
    this.slotErrors[day] = '';
  }

  private timeToMinutes(t: string): number {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
  }


  //  Save / Update doctor
  submit(doctorForm: NgForm) {
    if (doctorForm.invalid || this.ageError) {
      Object.keys(doctorForm.controls).forEach(key => doctorForm.controls[key].markAsTouched());
      return;
    }
    if (!this.slotModel.SlotDuration || this.slotModel.SlotDuration <= 0) {
      this.sweetAlertService.alertMessage('Please enter a valid slot duration before saving.');
      return;
    }
    // Validate all day slots first
    this.weekDays.forEach(day => this.validateDaySlots(day));

    // Collect days that have slot errors
    const errorDays = Object.keys(this.slotErrors)
      .filter(day => !!this.slotErrors[day])
      .map(day => `${day}: ${this.slotErrors[day]}`);

    if (errorDays.length > 0) {
      const errorMessage = 'Please fix the following slot issues before saving:\n\n' + errorDays.join('\n');
      this.sweetAlertService.alertMessage(errorMessage);
      return;
    }
    const doctorData: doctorModel = this.model;
    const slotData: SlotModel = this.slotModel;

    // Build weekly schedule
    const dayNameToNumberMap: { [key: string]: number } = {
      Sunday: 0, Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, Friday: 5, Saturday: 6
    };
    const weeklySchedule = [];
    for (const day of this.weekDays) {
      const timeRanges = this.dayTimes[day];
      if (timeRanges && timeRanges.length > 0) {
        const dayOfWeek = dayNameToNumberMap[day];
        for (const time of timeRanges) {
          if (time.startTime && time.endTime) {
            weeklySchedule.push({
              dayOfWeek: dayOfWeek,
              startTime: time.startTime,
              endTime: time.endTime
            });
          }
        }
      }
    }

    const payload = {
      doctor: doctorData,
      slotDuration: slotData.SlotDuration,
      weeklySchedule: weeklySchedule
    };

    if (this.isEditMode) {
      this.doctorService.createOrUpdateDoctorWithSchedule(payload).subscribe({
        next: () => {
          this.sweetAlertService.showSuccess('Doctor updated successfully!');
          this.router.navigate(['/admin']);
        },
        error: (err) => this.sweetAlertService.showError(err?.error?.message || 'Failed to update doctor')
      });
    } else {
      this.doctorService.createOrUpdateDoctorWithSchedule(payload).subscribe({
        next: () => {
          this.sweetAlertService.showSuccess('Doctor created successfully!');
          this.router.navigate(['/admin']);
        },
        error: (err) => this.sweetAlertService.showError(err?.error?.message || 'Failed to create doctor')
      });
    }
  }

}

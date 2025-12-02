import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { DoctorService } from '../../../core/services/doctor.service';
import { SlotModel } from '../../../core/models/SlotModel';
import { SweetAlertService } from '../../../core/services/sweet-alert.service';
import { AppointmentRequestService } from '../../../core/services/appointment-request.service';


@Component({
  selector: 'app-reschedule-modal',
  standalone: false,
  templateUrl: './reschedule-modal.component.html',
  styleUrl: './reschedule-modal.component.css'
})

export class RescheduleModalComponent {
  @Input() doctorId!: number;
  @Input() appointmentId!: number;
  @Input() patientEmail!: string;


  days: { label: string; date: Date; key: string }[] = [];
  dayIndex = 0;
  slotsByDate: { [key: string]: SlotModel[] } = {};
  selectedSlot: SlotModel | null = null;
  loadingSlots = false;

  constructor(
    public activeModal: NgbActiveModal,
    private doctorService: DoctorService,
    private appointmentRequestService: AppointmentRequestService,
    private sweetAlertService: SweetAlertService
  ) { }

  ngOnInit() {
    this.generateDays();
    this.fetchSlotsForRange();
  }

  generateDays() {
    const formatter = new Intl.DateTimeFormat(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });

    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const label = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : formatter.format(d);
      const key = d.toISOString().slice(0, 10);
      this.days.push({ label, date: d, key });
    }
  }

  fetchSlotsForRange() {
    this.loadingSlots = true;
    const start = this.days[0].date;
    const end = this.days[this.days.length - 1].date;

    this.doctorService.getAvailableSlots(this.doctorId, start, end).subscribe({
      next: (slots) => {
        this.slotsByDate = this.groupSlotsByDate(slots);
        this.loadingSlots = false;
      },
      error: () => {
        this.loadingSlots = false;
        this.sweetAlertService.showError('Failed to load slots');
      }
    });
  }

  private groupSlotsByDate(slots: any[]): { [key: string]: SlotModel[] } {
    const grouped: { [key: string]: SlotModel[] } = {};
    for (const slot of slots) {
      const dateKey = new Date(slot.SlotDate).toISOString().split('T')[0];
      if (!grouped[dateKey]) grouped[dateKey] = [];
      grouped[dateKey].push({
        slotId: slot.SlotId,
        doctorId: slot.DoctorId,
        slotDate: dateKey,
        startTime: slot.StartTime,
        endTime: slot.EndTime
      });
    }
    return grouped;
  }

  selectDay(index: number) {
    this.dayIndex = index;
  }

  getSlotsForSelectedDay(): SlotModel[] {
    const key = this.days[this.dayIndex].key;
    return this.slotsByDate[key] ?? [];
  }

  selectSlot(slot: SlotModel) {
    this.selectedSlot = slot;
  }

  confirmReschedule() {
    if (!this.selectedSlot) {
      return;
    }
    this.doctorService
      .rescheduleAppointment(this.appointmentId, this.patientEmail, this.selectedSlot)
      .subscribe({
        next: (res) => {
          this.sweetAlertService.showSuccess('Appointment Rescheduled');
          this.activeModal.close();
        },
        error: () => {
          this.sweetAlertService.showError('Failed to send reschedule request.');
        }
      });
  }
}

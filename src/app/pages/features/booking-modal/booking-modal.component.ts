import { Component, ElementRef, HostListener, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SlotModel } from '../../../core/models/SlotModel';
import { DoctorService } from '../../../core/services/doctor.service';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-booking-modal',
  standalone: false,
  templateUrl: './booking-modal.component.html',
  styleUrl: './booking-modal.component.css'
})
export class BookingModalComponent {
  @Input() doctor: any;

  days: { label: string; date: Date; key: string }[] = [];
  dayIndex = 0;
  slotsByDate: { [dateKey: string]: SlotModel[] } = {};

  constructor(public activeModal: NgbActiveModal, private doctorService: DoctorService, private router: Router,) { }

  ngOnInit() {
    this.generateDays();
    this.fetchSlotsForRange();
    document.body.style.overflow = 'hidden';
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
    if (!this.doctor) return;

    const start = this.days[0].date;
    const end = this.days[this.days.length - 1].date;

    this.doctorService.getAvailableSlots(this.doctor.id || this.doctor.DoctorId, start, end).subscribe({
      next: (slots) => {
        this.slotsByDate = this.groupSlotsByDate(slots);
      },
      error: (err) => {
        console.error('Failed to fetch slots', err);
      }
    });
  }

  private groupSlotsByDate(slots: any[]): { [key: string]: SlotModel[] } {
    const grouped: { [key: string]: SlotModel[] } = {};

    for (const slot of slots) {
      const dateKey = new Date(slot.SlotDate).toISOString().split('T')[0];

      if (!grouped[dateKey]) grouped[dateKey] = [];

      // mapping 
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
    const slots = this.slotsByDate[key] ?? [];

    const todayKey = new Date().toISOString().split('T')[0];

    if (key === todayKey) {
      const now = new Date();
      const cutoff = new Date(now.getTime() + 60 * 60 * 1000); 

      return slots.filter(s => {
        const slotDateTime = new Date(`${s.slotDate}T${s.startTime}`);
        return slotDateTime >= cutoff;
      });
    }

    return slots;
  }

  handleBook(slot: SlotModel) {
    this.activeModal.close();

    // Passing all relevant info using state
    this.router.navigate(['/appointment-request'], {
      state: {
        doctor: this.doctor,
        slot: slot
      }
    });
  }

  closeModal() {
    this.activeModal.dismiss();
  }

}

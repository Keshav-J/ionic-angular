import { Component, Input, OnInit, ViewChild } from '@angular/core';

import { ModalController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { Place } from 'src/app/places/place.model';

@Component({
  selector: 'app-create-booking',
  templateUrl: './create-booking.component.html',
  styleUrls: ['./create-booking.component.scss'],
})
export class CreateBookingComponent implements OnInit {
  @ViewChild('createBookingForm', {static: true}) createBookingForm: NgForm;

  @Input() selectedPlace: Place;
  @Input() selectedMode: 'select' | 'random';

  startDate: string;
  endDate: string;

  constructor(
    private modalCtrl: ModalController,
  ) { }

  ngOnInit() {
    const availableFrom = new Date(this.selectedPlace.availableFrom);
    const availableTo = new Date(this.selectedPlace.availableTo);
    if (this.selectedMode === 'random') {
      this.startDate =
        new Date(availableFrom.getTime() + Math.random() * (availableTo.getTime() - 7 * 24 * 60 * 60 * 1000 - availableFrom.getTime()))
          .toISOString();
      this.endDate =
        new Date(new Date(this.startDate).getTime() + Math.random() * (availableTo.getTime() - new Date(this.startDate).getTime()))
          .toISOString();
    }
  }

  onBookPlace() {
    if (!this.createBookingForm.valid || !this.datesValid()) {
      return;
    }

    this.modalCtrl.dismiss({
      bookingData: {
        firstName: this.createBookingForm.value.firstName,
        lastName: this.createBookingForm.value.lastName,
        guestNumber: +this.createBookingForm.value.guestNumber,
        startDate: new Date(this.createBookingForm.value.dateFrom),
        endDate: new Date(this.createBookingForm.value.dateTo),
      }
    }, 'confirm');
  }

  onClose() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  datesValid() {
    const startDate = new Date(this.createBookingForm.value.dateFrom);
    const endDate = new Date(this.createBookingForm.value.dateTo);
    return endDate > startDate;
  }

}

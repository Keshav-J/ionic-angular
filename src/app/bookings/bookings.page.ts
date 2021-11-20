import { Component, OnInit } from '@angular/core';

import { Booking } from './booking.model';
import { BookingsService } from './bookings.service';
import { IonItemSliding } from '@ionic/angular';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit {
  bookings: Booking[];

  constructor(
    private bookingsService: BookingsService,
  ) { }

  ngOnInit() {
    this.bookings = this.bookingsService.bookings;
  }

  onCancelBooking(offerId: string, slidingEl: IonItemSliding) {
    slidingEl.close();
  }

}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { IonItemSliding, LoadingController } from '@ionic/angular';

import { Booking } from './booking.model';
import { BookingsService } from './bookings.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit, OnDestroy {
  bookings: Booking[];
  isLoading = false;

  private $bookingSub: Subscription;

  constructor(
    private bookingsService: BookingsService,
    private loadingCtrl: LoadingController,
  ) { }

  ngOnInit() {
    // this.bookings = this.bookingsService.bookings;
    this.$bookingSub = this.bookingsService.bookings.subscribe(bookings => {
      this.bookings = bookings;
    });
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.bookingsService.fetchBookings().subscribe(() => {
      this.isLoading = false;
    });
  }

  onCancelBooking(bookingId: string, slidingEl: IonItemSliding) {
    slidingEl.close();
    this.loadingCtrl.create({
      message: 'Cancelling...'
    }).then(loadingEl => {
      loadingEl.present();
      this.bookingsService.cancelBooking(bookingId).subscribe(() => {
        loadingEl.dismiss();
      });
    });
  }

  ngOnDestroy(): void {
    this.$bookingSub.unsubscribe();
  }

}

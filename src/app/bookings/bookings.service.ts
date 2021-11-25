import { delay, filter, take, tap } from 'rxjs/operators';

import { AuthService } from '../auth/auth.service';
import { BehaviorSubject } from 'rxjs';
/* eslint-disable no-underscore-dangle */
import { Booking } from './booking.model';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BookingsService {
  private _bookings = new BehaviorSubject<Booking[]>([]);

  get bookings() {
    return this._bookings.asObservable();
  }

  constructor(private authService: AuthService) { }

  addBooking(
    placeId: string,
    placeTitle: string,
    placeImage: string,
    firstName: string,
    lastName: string,
    guestNumber: number,
    fromDate: Date,
    toDate: Date
  ) {
    const newBooking = new Booking(
      Math.random().toString(),
      placeId,
      this.authService.userId,
      placeTitle,
      placeImage,
      firstName,
      lastName,
      guestNumber,
      fromDate,
      toDate
    );

    return this._bookings.pipe(
      take(1),
      delay(1000),
      tap(bookings => {
        this._bookings.next(bookings.concat(newBooking));
      }
    ));
  }

  cancelBooking(bookingId: string) {
    return this._bookings.pipe(
      take(1),
      delay(1000),
      tap(bookings => {
        this._bookings.next(bookings.filter(booking => booking.id !== bookingId));
      })
    );
  }
}

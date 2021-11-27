/* eslint-disable no-underscore-dangle */
import { delay, map, switchMap, take, tap } from 'rxjs/operators';

import { AuthService } from '../auth/auth.service';
import { BehaviorSubject } from 'rxjs';
import { Booking } from './booking.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

interface BookingData {
  firstName: string;
  fromDate: string;
  guestNumber: number;
  lastName: string;
  placeId: string;
  placeImage: string;
  placeTitle: string;
  toDate: string;
  userId: string;
}

@Injectable({
  providedIn: 'root'
})
export class BookingsService {
  private _bookings = new BehaviorSubject<Booking[]>([]);

  get bookings() {
    return this._bookings.asObservable();
  }

  constructor(
    private authService: AuthService,
    private http: HttpClient,
  ) { }

  fetchBookings() {
    return this.http.get<{[key: string]: BookingData}>(
      `https://ionic-angular-booking-app-db-default-rtdb.firebaseio.com/bookings.json?orderBy="userId"&equalTo="${this.authService.userId}"`
    ).pipe(
      map(bookingData => {
        const bookings = [];
        for (const key in bookingData) {
          if (bookingData.hasOwnProperty(key)) {
            bookings.push(new Booking(
              key,
              bookingData[key].placeId,
              bookingData[key].userId,
              bookingData[key].placeTitle,
              bookingData[key].placeImage,
              bookingData[key].firstName,
              bookingData[key].lastName,
              bookingData[key].guestNumber,
              new Date(bookingData[key].fromDate),
              new Date(bookingData[key].toDate),
            ));
          }
        }
        return bookings;
      }),
      tap(bookings => {
        this._bookings.next(bookings);
      })
    );
  }

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
    let generatedId;

    return this.http.post<{name: string}>(
      'https://ionic-angular-booking-app-db-default-rtdb.firebaseio.com/bookings.json',
      {...newBooking, id: null}
    ).pipe(
      switchMap(resData => {
        generatedId = resData.name;
        return this.bookings;
      }),
      take(1),
      tap(bookings => {
        newBooking.id = generatedId;
        this._bookings.next(bookings.concat(newBooking));
      })
    );
    // return this._bookings.pipe(
    //   take(1),
    //   delay(1000),
    //   tap(bookings => {
    //     this._bookings.next(bookings.concat(newBooking));
    //   }
    // ));
  }

  cancelBooking(bookingId: string) {
    return this.http.delete(
      `https://ionic-angular-booking-app-db-default-rtdb.firebaseio.com/bookings/${bookingId}.json`
    ).pipe(
      switchMap(() => this.bookings),
      take(1),
      tap(bookings => this._bookings.next(bookings.filter(booking => booking.id !== bookingId)))
    );
    return this._bookings.pipe(
      take(1),
      delay(1000),
      tap(bookings => {
        this._bookings.next(bookings.filter(booking => booking.id !== bookingId));
      })
    );
  }
}

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
    let fetchedUserId: string;
    return this.authService.userId.pipe(
      take(1),
      switchMap(userId => {
        if (!userId) {
          throw new Error('User not found!');
        }
        fetchedUserId = userId;
        return this.authService.token;
      }),
      take(1),
      switchMap(token => {
        if (!token) {
          throw new Error('Invalid token!');
        }
        return this.http.get<{[key: string]: BookingData}>(
          `https://ionic-angular-booking-app-db-default-rtdb.firebaseio.com/bookings.json?orderBy="userId"` +
          `&equalTo="${fetchedUserId}"&auth=${token}`
        );
      }),
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
    let generatedId: string;
    let newBooking: Booking;
    let fetchedUserId: string;
    return this.authService.userId.pipe(
      take(1),
      switchMap(userId => {
        if (!userId) {
          throw new Error('User not found!');
        }
        fetchedUserId = userId;
        return this.authService.token;
      }),
      take(1),
      switchMap(token => {
        newBooking = new Booking(
          Math.random().toString(),
          placeId,
          fetchedUserId,
          placeTitle,
          placeImage,
          firstName,
          lastName,
          guestNumber,
          fromDate,
          toDate
        );

        return this.http.post<{name: string}>(
          `https://ionic-angular-booking-app-db-default-rtdb.firebaseio.com/bookings.json?auth=${token}`,
          {...newBooking, id: null}
        );
      }),
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
    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        if (!token) {
          throw new Error('Invalid token!');
        }
        return this.http.delete(
          `https://ionic-angular-booking-app-db-default-rtdb.firebaseio.com/bookings/${bookingId}.json?auth=${token}`
        );
      }),
      take(1),
      switchMap(() => this.bookings),
      take(1),
      tap(bookings => this._bookings.next(bookings.filter(booking => booking.id !== bookingId)))
    );
    // return this._bookings.pipe(
    //   take(1),
    //   delay(1000),
    //   tap(bookings => {
    //     this._bookings.next(bookings.filter(booking => booking.id !== bookingId));
    //   })
    // );
  }
}

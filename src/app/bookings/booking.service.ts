import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { delay, switchMap, take, tap, map } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

import { Booking } from './booking.model';

interface BookingData {
  dateFrom: string;
  dateTo: string;
  firstName: string;
  guestNumber: number;
  lastName: string;
  placeId: string;
  placeImage: string;
  placeTitle: string;
  userId: string;
}

@Injectable({ providedIn: 'root' })

export class BookingService {
  private bookings = new BehaviorSubject<Booking[]>([]);

  get getBookings() {
    return this.bookings.asObservable();
  }

  constructor(private authService: AuthService, private http: HttpClient) { }

  addBooking(
    placeId: string,
    placeTitle: string,
    placeImg: string,
    firstName: string,
    lastName: string,
    guestNumber: number,
    dateFrom: Date,
    dateTo: Date
  ) {
    let generatedId: string;
    const newBooking = new Booking(
      Math.random().toString(),
      placeId,
      placeTitle,
      placeImg,
      firstName,
      lastName,
      this.authService.getUserId,
      guestNumber,
      dateFrom,
      dateTo
    );
    return this.http.post<{ name: string }>(
      'https://booking-app-e2ddc-default-rtdb.europe-west1.firebasedatabase.app/bookings.json',
      { ...newBooking, id: null }
    ).pipe(
      switchMap(res => {
        generatedId = res.name;
        return this.bookings;
      }),
      take(1),
      tap(bookings => {
        newBooking.id = generatedId;
        this.bookings.next(bookings.concat(newBooking));
      }));
  }

  cancelBooking(bookingId: string) {
    return this.http.delete(
      `https://booking-app-e2ddc-default-rtdb.europe-west1.firebasedatabase.app/bookings/${bookingId}.json`
    ).pipe(
      switchMap(() =>
        this.bookings),
      take(1),
      tap(bookings => {
        this.bookings.next(bookings.filter(b => b.id !== bookingId)
        );
      })
    );
  }

  fetchBookings() {
    return this.http.get<{ [key: string]: BookingData }>(
      // eslint-disable-next-line max-len
      `https://booking-app-e2ddc-default-rtdb.europe-west1.firebasedatabase.app/bookings.json?orderBy="userId"&equalTo="${this.authService.getUserId}"`
    ).pipe(
      map(bookingData => {
        const bookings = [];
        for (const key in bookingData) {
          if (bookingData.hasOwnProperty(key)) {
            bookings.push(
              new Booking(
                key,
                bookingData[key].placeId,
                bookingData[key].userId,
                bookingData[key].placeImage,
                bookingData[key].firstName,
                bookingData[key].lastName,
                bookingData[key].userId,
                bookingData[key].guestNumber,
                new Date(bookingData[key].dateFrom),
                new Date(bookingData[key].dateTo)
              ));
          }
        }
        return bookings;
      }), tap(bookings => {
        this.bookings.next(bookings);
      }));
  }
}

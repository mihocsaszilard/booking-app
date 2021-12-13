import { Injectable } from '@angular/core';
import { Booking } from './booking.model';

@Injectable({ providedIn: 'root' })

export class BookingService {
  private bookings: Booking[] = [
    {
      id: 'b1',
      placeId: 'p1',
      placeTitle: 'Manhattan Mansion',
      userId: 'u1',
      guestNumber: 12,
    },
    {
      id: 'b2',
      placeId: 'p2',
      placeTitle: 'Eiffel Tower',
      userId: 'u2',
      guestNumber: 22,
    },
    {
      id: 'b3',
      placeId: 'p3',
      placeTitle: 'New York Skyskraper',
      userId: 'u3',
      guestNumber: 15,
    },
    {
      id: 'b4',
      placeId: 'p4',
      placeTitle: 'Louvre',
      userId: 'u4',
      guestNumber: 229,
    },
    {
      id: 'b5',
      placeId: 'p5',
      placeTitle: 'Hotel Stallion',
      userId: 'u5',
      guestNumber: 2,
    },
  ];

  get getBookings() {
    return [...this.bookings];
  }
}

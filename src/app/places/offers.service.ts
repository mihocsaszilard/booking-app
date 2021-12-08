import { Injectable } from '@angular/core';
import { Offer } from './offers/offers.model';

@Injectable({
  providedIn: 'root'
})
export class OffersService {


  private offers: Offer[] = [
    new Offer('o1',
      'One room apartment',
      'Ideal for 1 person',
      // eslint-disable-next-line max-len
      'https://res.cloudinary.com/apartmentlist/image/fetch/f_auto,q_auto,t_renter_life_cover/https://images.ctfassets.net/jeox55pd4d8n/63f7dRCQZRCXDDOYx6p9fo/5d0dd6ba4a252bbc5415d437ee09270a/images_Studio-Apartment-.jpg',
      79.99
    ),
    new Offer('o2',
      'Two room apartment',
      'Ideal for 2 person',
      'https://www.myresidhome.com/images/residence/289/chambres/autres/289-t2-chambre.jpg',
      129.99
    ),
    new Offer('o3',
      'Three room apartment',
      'Ideal for 3 person',
      'http://silvapeakresidences.com/sites/default/files/2018-08/silvapeak-residences-apartment.jpg',
      199.99
    ),
  ];

  get getOffers() {
    return [...this.offers];
  }

  constructor() { }
}

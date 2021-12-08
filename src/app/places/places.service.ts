import { Injectable } from '@angular/core';
import { Place } from './places.model';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  private places: Place[] = [
    new Place(
      'p1',
      'Manhattan Mansion',
      // eslint-disable-next-line max-len
      'Everyone knows Manhattan is all about high-rise condos, tall apartment buildings, and any other kind of building in which people live above other people. ',
      // eslint-disable-next-line max-len
      'https://local12.com/resources/media/866c7412-79b7-401d-a927-0816656b54ee-large16x9_39East72ndStreetUpperEastSideNewYork_Lauren_Muss_DouglasElliman_Photography_81460525_high_res.jpg?1565893378398',
      299
    ),
    new Place(
      'p2',
      'Eiffel Tower',
      // eslint-disable-next-line max-len
      ' is a wrought-iron lattice tower on the Champ de Mars in Paris, France. It is named after the engineer Gustave Eiffel, whose company designed and built ',
      // eslint-disable-next-line max-len
      'https://www.toureiffel.paris/sites/default/files/actualite/image_principale/vue_depuisjardins_webbanner.jpg',
      159.99
    ),
    new Place(
      'p3',
      'Diamond Hotel',
      // eslint-disable-next-line max-len
      'The diamond ratings indicate the level of services and amenities available at each hotel. One diamond indicates accommodations that just meet the basic requirements of a AAA approved hotel, while five diamonds indicate the highest level of luxury.',
      // eslint-disable-next-line max-len
      'https://cf.bstatic.com/xdata/images/hotel/max1024x768/21866833.jpg?k=1b237330d5606ffba7470a57eae7500c79232c81a2a3a618eee01442611ad2bc&o=&hp=1',
      259.99
    ),
  ];

  get getPlaces() {
    return [...this.places];
  }

  constructor() { }

  getPlaceId(id: string) {
    return {
      ...this.places.find(p => p.id === id)
    };
  }
}

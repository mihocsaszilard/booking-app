import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { take, map, tap, delay, switchMap } from 'rxjs/operators';

import { AuthService } from '../auth/auth.service';
import { Place } from './places.model';


// new Place(
//   'p1',
//   'Manhattan Mansion',
//   // eslint-disable-next-line max-len
// eslint-disable-next-line max-len
//   'Everyone knows Manhattan is all about high-rise condos, tall apartment buildings, and any other kind of building in which people live above other people. ',
//   // eslint-disable-next-line max-len
// eslint-disable-next-line max-len
//   'https://local12.com/resources/media/866c7412-79b7-401d-a927-0816656b54ee-large16x9_39East72ndStreetUpperEastSideNewYork_Lauren_Muss_DouglasElliman_Photography_81460525_high_res.jpg?1565893378398',
//   299,
//   new Date('2020-01-01'),
//   new Date('2020-12-01'),
//   'abc'
// ),
// new Place(
//   'p2',
//   'Eiffel Tower',
//   // eslint-disable-next-line max-len
// eslint-disable-next-line max-len
//   ' is a wrought-iron lattice tower on the Champ de Mars in Paris, France. It is named after the engineer Gustave Eiffel, whose company designed and built ',
//   // eslint-disable-next-line max-len
//   'https://www.toureiffel.paris/sites/default/files/actualite/image_principale/vue_depuisjardins_webbanner.jpg',
//   159.99,
//   new Date('2020-01-01'),
//   new Date('2020-12-01'),
//   'abc'
// ),
// new Place(
//   'p3',
//   'Diamond Hotel',
//   // eslint-disable-next-line max-len
// eslint-disable-next-line max-len
//   'The diamond ratings indicate the level of services and amenities available at each hotel. One diamond indicates accommodations that just meet the basic requirements of a AAA approved hotel, while five diamonds indicate the highest level of luxury.',
//   // eslint-disable-next-line max-len
// eslint-disable-next-line max-len
//   'https://lh3.googleusercontent.com/proxy/R4WS3uxZYbWDPGc1GM6Snfg02IfDIY9bsrIRBMnxlTvNdr_ZHiuJkXwQPYii4cj9P7VFKPSbYA42cP-PULbFMBtY2GE_OkCR90pVCCebtZzDYUMLNufshKZ2QqqaqgBZJH4zv3_0Qwjy8GrZWqy17qshXowxeyLEHZRtQMM1X0g',
//   259.99,
//   new Date('2020-01-01'),
//   new Date('2020-12-01'),
//   'abc'
// ),


interface PlaceData {
  availableFrom: string;
  availableTo: string;
  description: string;
  imgUrl: string;
  price: number;
  title: string;
  userId: string;
}

@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  private places = new BehaviorSubject<Place[]>([]);

  get getPlaces() {
    return this.places.asObservable();
  }

  constructor(private authService: AuthService, private http: HttpClient) { }

  fetchPlaces() {
    return this.http.get<{ [key: string]: PlaceData }>(
      'https://booking-app-e2ddc-default-rtdb.europe-west1.firebasedatabase.app/offered-place.json'
    ).pipe(
      map(res => {
        const places = [];
        for (const key in res) {
          if (res.hasOwnProperty(key)) {
            places.push(
              new Place(
                key,
                res[key].title,
                res[key].description,
                res[key].imgUrl,
                res[key].price,
                new Date(res[key].availableFrom),
                new Date(res[key].availableTo),
                res[key].userId
              ));
          }
        }
        return places;
      }), tap(places => {
        this.places.next(places);
      })
    );
  }

  getPlaceId(id: string) {
    return this.http.get<PlaceData>(
      `https://booking-app-e2ddc-default-rtdb.europe-west1.firebasedatabase.app/offered-place/${id}.json`
    ).pipe(map(res => new Place(
      id,
      res.title,
      res.description,
      res.imgUrl,
      res.price,
      new Date(res.availableFrom),
      new Date(res.availableTo),
      res.userId
    ))
    );
  }

  addPlace(title: string, description: string, price: number, dateFrom: Date, dateTo: Date) {
    let generatedId: string;
    let newPlace: Place;
    return this.authService.getUserId.pipe(
      take(1),
      switchMap(userId => {
        if (!userId) {
          throw new Error('No user found!');
        }
        newPlace = new Place(
          Math.random().toString(),
          title, description,
          'https://exp.cdn-hotels.com/hotels/1000000/10000/6700/6666/4fd95a3a_z.jpg?impolicy=fcrop&w=500&h=333&q=medium',
          price,
          dateFrom,
          dateTo,
          userId
        );
        return this.http.post<{ name: string }>(
          'https://booking-app-e2ddc-default-rtdb.europe-west1.firebasedatabase.app/offered-place.json',
          { ...newPlace, id: null }
        );
      }),
      switchMap(res => {
        generatedId = res.name;
        return this.places;
      }), take(1), tap(places => {
        newPlace.id = generatedId;
        this.places.next(places.concat(newPlace));
      })
    );
    // return this.getPlaces.pipe(take(1), delay(1500), tap(places => {
    //   this.places.next(places.concat(newPlace));
    // })
    // );
  }

  updatePlace(placeId: string, title: string, description: string) {
    let updatedPlaces: Place[];
    return this.places.pipe(
      take(1), switchMap(places => {
        if (!places || places.length <= 0) {
          return this.fetchPlaces();
        } else {
          return of(places);
        }
      }),
      switchMap(places => {
        const updatedPlaceIndex = places.findIndex(pla => pla.id === placeId);
        updatedPlaces = [...places];
        const oldPlace = updatedPlaces[updatedPlaceIndex];
        updatedPlaces[updatedPlaceIndex] = new Place(
          oldPlace.id,
          title,
          description,
          oldPlace.imgUrl,
          oldPlace.price,
          oldPlace.availableFrom,
          oldPlace.availableTo,
          oldPlace.userId
        );
        return this.http.put(
          `https://booking-app-e2ddc-default-rtdb.europe-west1.firebasedatabase.app/offered-place/${placeId}.json`,
          { ...updatedPlaces[updatedPlaceIndex], id: null }
        );
      }), tap(() => {
        this.places.next(updatedPlaces);
      })
    );
  }
}

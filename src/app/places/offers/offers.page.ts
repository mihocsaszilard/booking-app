import { Component, OnDestroy, OnInit } from '@angular/core';
import { IonItemSliding } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Place } from '../places.model';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit, OnDestroy {

  offerPlaces: Place[];
  isLoading = false;
  private placesSub: Subscription;

  constructor(private placesService: PlacesService) { }

  ngOnInit() {
    this.placesSub = this.placesService.getPlaces.subscribe(places => {
      this.offerPlaces = places;
    });
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.placesService.fetchPlaces().subscribe(() => {
      this.isLoading = false;
    });
  }

  onClose(slidingItem: IonItemSliding) {
    slidingItem.close();
  }

  onDelete(offerId: string, slidingItem: IonItemSliding) {
    slidingItem.close();
    this.offerPlaces = this.offerPlaces.filter(p => p.id !== offerId);
  }

  ngOnDestroy() {
    if (this.placesSub) {
      this.placesSub.unsubscribe();
    }
  }
}

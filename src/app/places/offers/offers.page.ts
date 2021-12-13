import { Component, OnInit } from '@angular/core';
import { IonItemSliding } from '@ionic/angular';
import { Place } from '../places.model';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit {

  offerPlaces: Place[];

  constructor(private placesService: PlacesService) { }

  ngOnInit() {
    this.offerPlaces = this.placesService.getPlaces;
  }

  onClose(slidingItem: IonItemSliding) {
    slidingItem.close();
  }

  onDelete(offerId: string, slidingItem: IonItemSliding) {
    slidingItem.close();
    this.offerPlaces = this.offerPlaces.filter(p => p.id !== offerId);
  }
}

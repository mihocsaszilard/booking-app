import { Component, OnInit } from '@angular/core';
import { Place } from '../places.model';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit {

  discoverPlaces: Place[];

  constructor(private placesService: PlacesService) { }

  ngOnInit() {
    this.discoverPlaces = this.placesService.getPlaces;
  }
}

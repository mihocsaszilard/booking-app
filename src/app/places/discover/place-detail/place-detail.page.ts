import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Place } from '../../places.model';
import { PlacesService } from '../../places.service';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit {

  discoverPlaces: Place[];

  constructor(
    private router: Router,
    private navController: NavController,
    private placesService: PlacesService
  ) { }

  onBookPlace() {
    // this.router.navigateByUrl('/places/discover');
    this.navController.navigateBack('/places/tabs/discover');
  }

  ngOnInit() {
    this.discoverPlaces = this.placesService.getPlaces;
  }
}

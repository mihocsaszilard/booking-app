import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { MapModalComponent } from '../../map-modal/map-modal.component';

@Component({
  selector: 'app-location-picker',
  templateUrl: './location-picker.component.html',
  styleUrls: ['./location-picker.component.scss'],
})
export class LocationPickerComponent implements OnInit {

  constructor(private modalCtrl: ModalController, private http: HttpClient) { }

  ngOnInit() { }

  onPickLocation() {
    this.modalCtrl.create({
      component: MapModalComponent
    }).then(modalEl => {
      modalEl.onDidDismiss().then(modalData => {
        console.log(modalData.data);
        if (!modalData.data) {
          return;
        }
        this.getAddress(modalData.data.lat, modalData.data.lng).subscribe(
          () => { }
        );
      });
      modalEl.present();
    });
  }

  private getAddress(lat: number, lng: number) {
    return this.http.get(
      `https://maps.googleapis.com/maps.api.geocode/json?latlng=${lat},${lng}&key=${environment.googleMapsApiKey}`
    ).pipe(map(geoData => {
      console.log(geoData);
    })
    );
  }
}

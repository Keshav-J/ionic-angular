import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { map, switchMap } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { MapModalComponent } from '../../map-modal/map-modal.component';
import { ModalController } from '@ionic/angular';
import { PlaceLocation } from '../../../places/location.model';
import { environment } from '../../../../environments/environment';
import { of } from 'rxjs';

@Component({
  selector: 'app-location-picker',
  templateUrl: './location-picker.component.html',
  styleUrls: ['./location-picker.component.scss'],
})
export class LocationPickerComponent implements OnInit {
  @Output() locationPicked = new EventEmitter<PlaceLocation>();
  selectedLocationImage: string;
  isLoading = false;

  constructor(
    private modalCtrl: ModalController,
    private http: HttpClient,
  ) { }

  ngOnInit() {}

  onPickLocation() {
    this.modalCtrl.create({
      component: MapModalComponent
    }).then(modalEl => {
      modalEl.onDidDismiss().then(modalData => {
        if (!modalData.data) {
          return;
        }
        const pickedLocation: PlaceLocation = {
          lat: modalData.data.lat,
          lng: modalData.data.lng,
          address: null,
          staticMapImageURL: null
        };
        this.isLoading = true;
        this.getAddress(modalData.data.lat, modalData.data.lng)
          .pipe(
            switchMap(address => {
              pickedLocation.address = address;
              return of(this.getMapImage(pickedLocation.lat, pickedLocation.lng, 14));
            })
          )
          .subscribe(staticMapImageURL => {
            pickedLocation.staticMapImageURL = staticMapImageURL;
            this.selectedLocationImage = staticMapImageURL;
            this.isLoading = false;
            this.locationPicked.emit(pickedLocation);
          });
      });
      modalEl.present();
    });
  }

  private getAddress(lat: number, lng: number) {
    return this.http.get(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${environment.googleMapsAPIKey}`
    ).pipe(
      map((geoData: any) => {
        // Removing to hide API_KEY
        // if (!geoData || !geoData.results || geoData.results.length === 0) {
        //   return null;
        // }
        // return geoData.results[0].formatted_address;
        if (!geoData || !geoData.results) {
          return null;
        }
        return 'Fetched address';
      })
    );
  }

  private getMapImage(lat: number, lng: number, zoom: number) {
    // eslint-disable-next-line max-len
    return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=500x300&maptype=roadmap&markers=color:red%7Clabel:Place%7C${lat},${lng}&key=${environment.googleMapsAPIKey}`;
  }

}

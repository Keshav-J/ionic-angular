import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';

import { CreateBookingComponent } from '../../../bookings/create-booking/create-booking.component';
import { Place } from '../../place.model';
import { PlacesService } from '../../places.service';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit {
  place: Place;

  constructor(
    // private router: Router,
    private navCtrl: NavController,
    private modalController: ModalController,
    private route: ActivatedRoute,
    private placesService: PlacesService,
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('placeId')) {
        this.navCtrl.navigateBack('/places/tabs/discover');
      }

      this.place = this.placesService.places.find(p => p.id === paramMap.get('placeId'));
    });
  }

  onBookPlace() {
    // this.router.navigate(['/', 'places', 'tabs', 'discover']);
    // this.navCtrl.pop();
    // this.navCtrl.navigateBack('/places/tabs/discover');
    this.modalController
      .create({component: CreateBookingComponent, componentProps: {selectedPlace: this.place}})
      .then(modalEl => {
        modalEl.present();
        return modalEl.onDidDismiss();
      })
      .then((resultData: any) => {
        console.log(resultData.data, resultData.role);
        if (resultData.role === 'confirm') {
          console.log('BOOKED!');
        }
      });
  }

}

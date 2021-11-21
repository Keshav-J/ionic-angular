import { ActionSheetController, ModalController, NavController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

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
    private actionSheetCtrl: ActionSheetController,
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
    this.actionSheetCtrl.create({
      header: 'Choose an action',
      buttons: [
        {
          text: 'Select Date',
          handler: () => {
            this.openBookingModal('select');
          }
        },
        {
          text: 'Random Date',
          handler: () => {
            this.openBookingModal('random');
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    }).then(actionSheetEl => {
      actionSheetEl.present();
    });
    // this.router.navigate(['/', 'places', 'tabs', 'discover']);
    // this.navCtrl.pop();
    // this.navCtrl.navigateBack('/places/tabs/discover');
  }

  openBookingModal(mode: 'select' | 'random') {
    console.log(mode);
    this.modalController
      .create({component: CreateBookingComponent, componentProps: {selectedPlace: this.place, selectedMode: mode}})
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

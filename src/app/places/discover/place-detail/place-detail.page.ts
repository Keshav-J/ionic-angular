import { ActionSheetController, LoadingController, ModalController, NavController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';

import { AuthService } from 'src/app/auth/auth.service';
import { BookingsService } from 'src/app/bookings/bookings.service';
import { CreateBookingComponent } from '../../../bookings/create-booking/create-booking.component';
import { Place } from '../../place.model';
import { PlacesService } from '../../places.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit, OnDestroy {
  place: Place;
  isBookable = false;

  private $placeSub: Subscription;

  constructor(
    // private router: Router,
    private navCtrl: NavController,
    private modalController: ModalController,
    private route: ActivatedRoute,
    private placesService: PlacesService,
    private actionSheetCtrl: ActionSheetController,
    private bookinsService: BookingsService,
    private loadingCtrl: LoadingController,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('placeId')) {
        this.navCtrl.navigateBack('/places/tabs/discover');
      }

      // this.place = this.placesService.places.find(p => p.id === paramMap.get('placeId'));
      this.$placeSub = this.placesService.getPlace(paramMap.get('placeId')).subscribe(place => {
        this.place = place;
        this.isBookable = this.authService.userId !== place.userId;
      });
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
        if (resultData.role === 'confirm') {
          this.loadingCtrl.create({
            message: 'Booking place...'
          }).then(loadingEl => {
            loadingEl.present();
            const bookingData = resultData.data.bookingData;
            this.bookinsService.addBooking(
              this.place.id,
              this.place.title,
              this.place.imageURL,
              bookingData.firstName,
              bookingData.lastName,
              bookingData.guestNumber,
              bookingData.startDate,
              bookingData.endDate
            ).subscribe(() => {
              loadingEl.dismiss();
              console.log('BOOKED!');
            });
          });
        }
      });
  }

  ngOnDestroy(): void {
    if (this.$placeSub) {
      this.$placeSub.unsubscribe();
    }
  }

}

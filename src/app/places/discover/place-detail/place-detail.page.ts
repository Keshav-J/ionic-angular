import { ActionSheetController, AlertController, LoadingController, ModalController, NavController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { switchMap, take } from 'rxjs/operators';

import { AuthService } from '../../../auth/auth.service';
import { BookingsService } from '../../../bookings/bookings.service';
import { CreateBookingComponent } from '../../../bookings/create-booking/create-booking.component';
import { MapModalComponent } from '../../../shared/map-modal/map-modal.component';
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
  isLoading = false;

  private $placeSub: Subscription;

  constructor(
    private router: Router,
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private route: ActivatedRoute,
    private placesService: PlacesService,
    private actionSheetCtrl: ActionSheetController,
    private bookinsService: BookingsService,
    private loadingCtrl: LoadingController,
    private authService: AuthService,
    private alertCtrl: AlertController,
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('placeId')) {
        this.navCtrl.navigateBack('/places/tabs/discover');
      }

      // this.place = this.placesService.places.find(p => p.id === paramMap.get('placeId'));
      this.isLoading = true;
      let fetchedUserId: string;
      this.authService.userId.pipe(
          take(1),
          switchMap(userId => {
            if (!userId) {
              throw new Error('No user found!');
            }
            fetchedUserId = userId;
            return this.placesService.getPlace(paramMap.get('placeId'));
          })
        ).subscribe(place => {
            this.place = place;
            this.isBookable = place.userId !== fetchedUserId;
            this.isLoading = false;
          },
          () => {
            this.alertCtrl.create({
              header: 'An error occured!',
              message: 'Could no load place.',
              buttons: [{
                text: 'Okay',
                handler: () => {
                  this.router.navigate(['/', 'places', 'tabs', 'discover']);
                }
              }]
            }).then(alertEl => {
              alertEl.present();
            });
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
    this.modalCtrl
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
            });
          });
        }
      });
  }

  onShowFullMap() {
    this.modalCtrl.create({
      component: MapModalComponent,
      componentProps: {
        center: {
          lat:this.place.location.lat,
          lng:this.place.location.lng,
        },
        selectable: false,
        closeButtonText: 'Close',
        title: this.place.location.address,
      }
    }).then(modalEl => {
      modalEl.present();
    });
  }

  ngOnDestroy(): void {
    if (this.$placeSub) {
      this.$placeSub.unsubscribe();
    }
  }

}

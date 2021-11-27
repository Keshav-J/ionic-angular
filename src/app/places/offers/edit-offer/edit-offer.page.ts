import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Place } from '../../place.model';
import { PlacesService } from '../../places.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.page.html',
  styleUrls: ['./edit-offer.page.scss'],
})
export class EditOfferPage implements OnInit, OnDestroy {
  form: FormGroup;
  place: Place;
  placeId: string;
  isLoading = false;

  private $placeSub: Subscription;

  constructor(
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private placesService: PlacesService,
    private loadingCtrl: LoadingController,
    private router: Router,
    private alertCtrl: AlertController,
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('placeId')) {
        this.navCtrl.navigateBack('/places/tabs/offers');
      }
      this.placeId = paramMap.get('placeId');

      // this.place = this.placesService.getPlace(paramMap.get('placeId'));
      this.isLoading = true;
      this.$placeSub = this.placesService.getPlace(paramMap.get('placeId')).subscribe(place => {
        this.place = place;
        this.form = new FormGroup({
          title: new FormControl(this.place.title, {
            updateOn: 'blur',
            validators: [Validators.required]
          }),
          description: new FormControl(this.place.description, {
            updateOn: 'blur',
            validators: [Validators.required, Validators.maxLength(180)]
          }),
        });
        this.isLoading = false;
      },
      () => {
        this.alertCtrl.create({
          header: 'An error occured!',
          message: 'Place could not be fetched. Please try again later.',
          buttons: [{
            text: 'Okay',
            handler: () => {
              this.router.navigate(['/', 'places', 'tabs', 'offers']);
            }
          }]
        }).then(alertEl => {
          alertEl.present();
        });
      });
    });
  }

  onUpdateOffer() {
    if (!this.form.valid) {
      return;
    }
    console.log(this.form);

    this.loadingCtrl.create({message: 'Updating Place...'})
      .then(loadingEl => {
        loadingEl.present();
        this.placesService.updatePlace(this.place.id, this.form.value.title, this.form.value.description)
          .subscribe(() => {
            loadingEl.dismiss();
            this.form.reset();
            this.router.navigate(['/', 'places', 'tabs', 'offers']);
          });
      });
  }

  ngOnDestroy(): void {
    if (this.$placeSub) {
      this.$placeSub.unsubscribe();
    }
  }

}

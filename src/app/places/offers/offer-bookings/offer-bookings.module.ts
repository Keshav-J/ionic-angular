import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { OfferBookingsPage } from './offer-bookings.page';
import { OfferBookingsPageRoutingModule } from './offer-bookings-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OfferBookingsPageRoutingModule
  ],
  declarations: [OfferBookingsPage]
})
export class OfferBookingsPageModule {}

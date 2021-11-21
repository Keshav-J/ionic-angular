import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { NewOfferPage } from './new-offer.page';
import { NewOfferPageRoutingModule } from './new-offer-routing.module';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    NewOfferPageRoutingModule
  ],
  declarations: [NewOfferPage]
})
export class NewOfferPageModule {}

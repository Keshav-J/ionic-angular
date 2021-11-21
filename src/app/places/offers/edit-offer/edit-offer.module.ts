import { CommonModule } from '@angular/common';
import { EditOfferPage } from './edit-offer.page';
import { EditOfferPageRoutingModule } from './edit-offer-routing.module';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    EditOfferPageRoutingModule
  ],
  declarations: [EditOfferPage]
})
export class EditOfferPageModule {}

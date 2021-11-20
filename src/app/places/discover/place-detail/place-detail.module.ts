import { CommonModule } from '@angular/common';
import { CreateBookingComponent } from '../../../bookings/create-booking/create-booking.component';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { PlaceDetailPage } from './place-detail.page';
import { PlaceDetailPageRoutingModule } from './place-detail-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlaceDetailPageRoutingModule,
  ],
  declarations: [PlaceDetailPage, CreateBookingComponent]
})
export class PlaceDetailPageModule {}

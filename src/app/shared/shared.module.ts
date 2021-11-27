import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { LocationPickerComponent } from './pickers/location-picker/location-picker.component';
import { MapModalComponent } from './map-modal/map-modal.component';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [LocationPickerComponent, MapModalComponent],
  entryComponents: [MapModalComponent],
  imports: [CommonModule, IonicModule],
  exports: [LocationPickerComponent, MapModalComponent],
})
export class SharedModule { }

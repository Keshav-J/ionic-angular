// import '@ionic/pwa-elements';

import { AppModule } from './app/app.module';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { enableProdMode } from '@angular/core';
import { environment } from './environments/environment';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

if (environment.production) {
  enableProdMode();
}

defineCustomElements(window);
platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));

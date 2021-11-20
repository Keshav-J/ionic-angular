import { RouterModule, Routes } from '@angular/router';

import { NgModule } from '@angular/core';
import { PlacesPage } from './places.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/places/tabs/discover',
    pathMatch: 'full'
  },
  {
    path: 'tabs',
    component: PlacesPage,
    children: [
      {
        path: '',
        redirectTo: '/places/tabs/discover',
        pathMatch: 'full'
      },
      {
        path: 'discover',
        loadChildren: () => import('./discover/discover.module').then(m => m.DiscoverPageModule)
        // children: [
        //   {
        //     path: '',
        //     loadChildren: () => import('./discover/discover.module').then(m => m.DiscoverPageModule)
        //   },
        //   {
        //     path: ':placeId',
        //     loadChildren: () => import('./discover/place-detail/place-detail.module').then(m => m.PlaceDetailPageModule)
        //   }
        // ]
      },
      {
        path: 'offers',
        loadChildren: () => import('./offers/offers.module').then(m => m.OffersPageModule)
      }
    ]
  },
  // {
  //   path: 'discover',
  //   loadChildren: () => import('./discover/discover.module').then( m => m.DiscoverPageModule)
  // },
  // {
  //   path: 'offers',
  //   loadChildren: () => import('./offers/offers.module').then( m => m.OffersPageModule)
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlacesPageRoutingModule {}

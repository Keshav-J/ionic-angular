/* eslint-disable no-underscore-dangle */
import { delay, map, take, tap } from 'rxjs/operators';

import { AuthService } from '../auth/auth.service';
import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Place } from './place.model';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private _places = new BehaviorSubject<Place[]>([
    new Place(
      'p1',
      'Manhattan Mansion',
      'In the heart of New York City.',
      'https://imgs.6sqft.com/wp-content/uploads/2014/06/21042533/Carnegie-Mansion-nyc.jpg',
      149.99,
      new Date('2019-01-01'),
      new Date('2019-12-31'),
      'abc',
    ),
    new Place(
      'p2',
      'L\'Amour Toujours',
      'Romantic place in Paris!',
      'https://i.ytimg.com/vi/jBzG0tD2RmA/maxresdefault.jpg',
      189.99,
      new Date('2019-01-01'),
      new Date('2019-12-31'),
      'abc',
    ),
    new Place(
      'p3',
      'The Foggy Palace',
      'Not you average city t rip!',
      'https://i.pinimg.com/originals/9c/88/44/9c8844b217bdb6c17db14f51ad2e51a5.jpg',
      99.99,
      new Date('2019-01-01'),
      new Date('2019-12-31'),
      'abc',
    ),
  ]);

  get places() {
    // return [...this._places];
    return this._places.asObservable();
  }

  constructor(private authService: AuthService) {}

  getPlace(placeId: string) {
    // return {...this.places.find(place => place.id === placeId)};
    return this.places.pipe(take(1), map(places => ({...places.find(place => place.id === placeId)})));
  }

  addPlace(title: string, description: string, price: number, dateFrom: Date, dateTo: Date) {
    const newPlace = new Place(
      Math.random().toString(),
      title,
      description,
      'https://i.pinimg.com/originals/9c/88/44/9c8844b217bdb6c17db14f51ad2e51a5.jpg',
      price,
      dateFrom,
      dateTo,
      this.authService.userId,
    );

    return this.places.pipe(take(1), delay(1000), tap(places => {
      this._places.next(places.concat(newPlace));
    }));
  }

  updatePlace(placeId: string, title: string, description: string) {
    return this.places.pipe(
      take(1),
      delay(1000),
      tap(places => {
        const updatePlaceIndex = places.findIndex(place => place.id === placeId);
        const updatedPlaces = [...places];
        const oldPlace = updatedPlaces[updatePlaceIndex];
        updatedPlaces[updatePlaceIndex] = new Place(
            oldPlace.id,
            title,
            description,
            oldPlace.imageURL,
            oldPlace.price,
            oldPlace.availableFrom,
            oldPlace.availableTo,
            oldPlace.userId,
          );
        this._places.next(updatedPlaces);
      })
    );
  }
}

/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { Place } from './place.model';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private _places: Place[] = [
    new Place(
      'p1',
      'Manhattan Mansion',
      'In the heart of New York City.',
      'https://imgs.6sqft.com/wp-content/uploads/2014/06/21042533/Carnegie-Mansion-nyc.jpg',
      149.99
    ),
    new Place(
      'p2',
      'L\'Amour Toujours',
      'Romantic place in Paris!',
      'https://i.ytimg.com/vi/jBzG0tD2RmA/maxresdefault.jpg',
      189.99
    ),
    new Place(
      'p3',
      'The Foggy Palace',
      'Not you average city t rip!',
      'https://i.pinimg.com/originals/9c/88/44/9c8844b217bdb6c17db14f51ad2e51a5.jpg',
      99.99
    ),
  ];

  get places() {
    return [...this._places];
  }

  constructor() {}
}

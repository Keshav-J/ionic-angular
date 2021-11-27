import { BehaviorSubject, of } from 'rxjs';
/* eslint-disable no-underscore-dangle */
import { delay, map, switchMap, take, tap } from 'rxjs/operators';

import { AuthService } from '../auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Place } from './place.model';
import { PlaceLocation } from './location.model';

interface PlaceData {
  availableFrom: string;
  availableTo: string;
  description: string;
  imageURL: string;
  price: number;
  title: string;
  userId: string;
  location: PlaceLocation;
}

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private _places = new BehaviorSubject<Place[]>([]);

  get places() {
    // return [...this._places];
    return this._places.asObservable();
  }

  constructor(
    private authService: AuthService,
    private http: HttpClient,
  ) {}

  fetchPlaces() {
    return this.http.get<{[key: string]: PlaceData}>('https://ionic-angular-booking-app-db-default-rtdb.firebaseio.com/offered-places.json')
      .pipe(map(resData => {
        const places = [];
        for (const key in resData) {
          if (resData.hasOwnProperty(key)) {
            places.push(new Place(
              key,
              resData[key].title,
              resData[key].description,
              resData[key].imageURL,
              resData[key].price,
              new Date(resData[key].availableFrom),
              new Date(resData[key].availableTo),
              resData[key].userId,
              resData[key].location,
            ));
          }
        }
        return places;
      }),
      tap(places => {
        this._places.next(places);
      }));
  }

  getPlace(placeId: string) {
    // return {...this.places.find(place => place.id === placeId)};
    // return this.places.pipe(take(1), map(places => ({...places.find(place => place.id === placeId)})));
    return this.http
      .get<PlaceData>(`https://ionic-angular-booking-app-db-default-rtdb.firebaseio.com/offered-places/${placeId}.json`)
      .pipe(
        map(placeData => new Place(
            placeId,
            placeData.title,
            placeData.description,
            placeData.imageURL,
            placeData.price,
            new Date(placeData.availableFrom),
            new Date(placeData.availableTo),
            placeData.userId,
            placeData.location,
          ))
      );
  }

  addPlace(title: string, description: string, price: number, dateFrom: Date, dateTo: Date, location: PlaceLocation) {
    let generatedId: string;
    const newPlace = new Place(
      Math.random().toString(),
      title,
      description,
      'https://i.pinimg.com/originals/9c/88/44/9c8844b217bdb6c17db14f51ad2e51a5.jpg',
      price,
      dateFrom,
      dateTo,
      this.authService.userId,
      location,
    );

    return this.http
      .post<{name: string}>('https://ionic-angular-booking-app-db-default-rtdb.firebaseio.com/offered-places.json', {...newPlace, id: null})
      .pipe(
        switchMap(resData => {
          generatedId = resData.name;
          return this.places;
        }),
        take(1),
        tap(places => {
          newPlace.id = generatedId;
          return this._places.next(places.concat(newPlace));
        })
      );
    // return this.places.pipe(take(1), delay(1000), tap(places => {
    //   this._places.next(places.concat(newPlace));
    // }));
  }

  updatePlace(placeId: string, title: string, description: string) {
    let updatedPlaces = [];
    return this.places.pipe(
      take(1),
      switchMap(places => {
        if (!places || places.length <= 0) {
          return this.fetchPlaces();
        } else {
          return of(places);
        }
      }),
      switchMap(places => {
        const updatePlaceIndex = places.findIndex(place => place.id === placeId);
        updatedPlaces = [...places];
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
            oldPlace.location,
          );
        return this.http
          .put(`https://ionic-angular-booking-app-db-default-rtdb.firebaseio.com/offered-places/${placeId}.json`,
            {...updatedPlaces[updatePlaceIndex], id: null});
      }),
      tap(() => {
        this._places.next(updatedPlaces);
      })
    );
    // return this.places.pipe(
    //   take(1),
    //   delay(1000),
    //   tap(places => {
    //     const updatePlaceIndex = places.findIndex(place => place.id === placeId);
    //     const updatedPlaces = [...places];
    //     const oldPlace = updatedPlaces[updatePlaceIndex];
    //     updatedPlaces[updatePlaceIndex] = new Place(
    //         oldPlace.id,
    //         title,
    //         description,
    //         oldPlace.imageURL,
    //         oldPlace.price,
    //         oldPlace.availableFrom,
    //         oldPlace.availableTo,
    //         oldPlace.userId,
    //       );
    //     this._places.next(updatedPlaces);
    //   })
    // );
  }
}

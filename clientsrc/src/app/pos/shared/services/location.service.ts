import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LocationRepository } from '../data/location-repository';

@Injectable({ providedIn: 'root' })
export class LocationService {

    constructor(
        private locationRepository: LocationRepository
    ) { }
    get(): Observable<any> {
        return Observable.create(observer => {
            const locations = this.locationRepository.get();

            observer.next(locations);
            observer.complete();
        });
    }
}

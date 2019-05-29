import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BarCodeRepository } from '../data/barcode-repository';

@Injectable({ providedIn: 'root' })
export class BarCodeService {

    constructor(
        private barCodeRepository: BarCodeRepository
    ) { }
    get(): Observable<any> {
        return Observable.create(observer => {
            const barCodes = this.barCodeRepository.get();

            observer.next(barCodes);
            observer.complete();
        });
    }
}

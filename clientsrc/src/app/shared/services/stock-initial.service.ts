import { Injectable } from '@angular/core';
import { ServiceBase } from './service-base';
import { environment } from 'src/environments/environment';
import { CategoryModel } from 'src/app/ims/categories/category.model';

@Injectable({ providedIn: 'root' })
export class StockInitialService extends ServiceBase {
    exportCSV(locationId: string, categories: string[]) {
        let request = `locationId=${locationId}`;

        if (categories || categories !== undefined || categories.length > 0) {
            categories.forEach(x => {
                request += `&categories=${x}`;
            });
        }

        return this
            .get<any>(`${environment.app.ims.apiUrl}/api/stock-transaction/exportcsv?${request}`,
                null, { responseType: 'text/csv' });
    }

    importCSV(file: File | null, fromLocationId: string, toLocationId: string) {
        const formdata: FormData = new FormData();
        if (file) {
            formdata.append('file', file, file.name);
        }

        return this.uploadFile(
            `${environment.app.ims.apiUrl}/api/stock-transaction/importcsv?fromLocationId=${fromLocationId}&toLocationId=${toLocationId}`,
            formdata,
            {
                reportProgress: true,
                responseType: 'text'
            }
        );
    }
}

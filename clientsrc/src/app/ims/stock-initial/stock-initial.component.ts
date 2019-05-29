import { Component, Injector } from '@angular/core';
import { ComponentBase } from 'src/app/shared/components/component-base';
import { LocationModel } from '../locations/location.model';
import { LocationService } from 'src/app/shared/services/location.service';
import { StockInitialService } from 'src/app/shared/services/stock-initial.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ImportCsvComponent } from './import-csv/import-csv.component';
import { CategoryService } from 'src/app/shared/services/category.service';
import { CategoryModel } from '../categories/category.model';
@Component({
  selector: 'app-stock-initial',
  templateUrl: './stock-initial.component.html',
  styleUrls: ['./stock-initial.component.scss']
})
export class StockInitialComponent extends ComponentBase {

  public locations: LocationModel[] = [];
  public categories: CategoryModel[] = [];
  public isLocationsLoading = true;
  public isCategoriesLoading = true;
  public selectedLocation: LocationModel = null;
  public selectedCategories: CategoryModel[] = [];
  public componentActive = true;
  constructor(private locationService: LocationService,
    private stockInitialService: StockInitialService,
    private categoryService: CategoryService,
    private modalService: NgbModal,
    public injector: Injector) {
    super(injector);
  }

  onInit() {
    this.getLocations();
    this.getCategories();
  }

  onDestroy() {

  }

  private getCategories() {
    this.isCategoriesLoading = true;

    this.categoryService.getAllCategory().subscribe(res => {
      this.categories = res;
      this.isCategoriesLoading = false;
    });
  }

  private getLocations() {
    this.isLocationsLoading = true;

    this.locationService.getAllWithoutPaging().subscribe(res => {
      this.locations = res;
      this.isLocationsLoading = false;
    });
  }

  private getRequestCategories(categories: CategoryModel[]) {
    const categoriesRequest = [];
    categories.forEach(x => categoriesRequest.push(x.id));
    return categoriesRequest;
  }

  public onClickExportCSV() {
    const categoriesRequest = this.getRequestCategories(this.selectedCategories);
    this.stockInitialService.exportCSV(this.selectedLocation.id, categoriesRequest).subscribe((data) => {
      const blob = new Blob([data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);

      if (navigator.msSaveOrOpenBlob) {
        navigator.msSaveBlob(blob, 'StockTransactions.csv');
      } else {
        const a = document.createElement('a');
        a.href = url;
        a.download = 'StockTransactions.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
      window.URL.revokeObjectURL(url);
    });
  }

  public onClickImportCSV() {
    const dialogRef = this.modalService.open(ImportCsvComponent, { size: 'lg', centered: true, backdrop: 'static' });
    const instance = dialogRef.componentInstance;
    instance.selectLocation = this.selectedLocation;
  }
}

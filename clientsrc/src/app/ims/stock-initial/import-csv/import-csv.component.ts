import { Component, OnInit, Input } from '@angular/core';
import { StockInitialService } from 'src/app/shared/services/stock-initial.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LocationModel, LocationType } from '../../locations/location.model';
import { HttpEventType } from '@angular/common/http';
import { checkJsonString } from 'src/app/shared/utils/JSON.util';
import { LocationService } from 'src/app/shared/services/location.service';

@Component({
  selector: 'app-import-csv',
  templateUrl: './import-csv.component.html',
  styleUrls: ['./import-csv.component.scss']
})
export class ImportCsvComponent implements OnInit {
  selectedFiles!: FileList;
  currentFileUpload!: File | null;
  public WarehouseLabel = 'Warehouse';
  public StoreLabel = 'Store';
  public isUploading = false;
  public message = '';
  public error = '';
  public percentDone = 0;
  public isLocationsLoading = true;

  public locationTypes = [this.WarehouseLabel, this.StoreLabel];
  public selectedLocationType = this.WarehouseLabel;

  public wareHouses: LocationModel[] = [];
  public selectedWareHouse: LocationModel = null;

  public stores: LocationModel[] = [];
  public selectedStore: LocationModel = null;

  constructor(private activeModal: NgbActiveModal,
    private locationService: LocationService,
    private stockInitialService: StockInitialService) { }

  ngOnInit() {
    this.getLocations();
  }

  onClose(): void {
    this.activeModal.close('closed');
  }

  onDismiss(reason: String): void {
    this.activeModal.dismiss(reason);
  }

  selectFile(event: { target: { files: FileList; }; }) {
    this.selectedFiles = event.target.files;
    if (this.selectedFiles !== null) {
      this.currentFileUpload = this.selectedFiles.item(0);
    }
    this.resetUploadInfo();
  }

  public upload() {
    const fromLocation = this.selectedWareHouse.id;
    let toLocation = '';
    if (this.selectedLocationType === this.WarehouseLabel) {
      toLocation = this.selectedWareHouse.id;
    }

    if (this.selectedLocationType === this.StoreLabel) {
      toLocation = this.selectedStore.id;
    }

    this.isUploading = true;
    this.resetUploadInfo();

    const uploadCSV$ = this.stockInitialService.importCSV(this.currentFileUpload, fromLocation, toLocation)
      .subscribe((event: any) => {
        if (event.type === HttpEventType.UploadProgress) {
          this.percentDone = Math.round(100 * (event.loaded + event.loaded) / (event.total + event.total));
        } else if (event.partialText) {
          if (checkJsonString(event.partialText)) {
            this.isUploading = false;
            const partialText = JSON.parse(event.partialText);
            if (partialText.isSuccess) {
              this.message = 'Upload success!';
            } else {
              this.error = partialText.errorMessage ? partialText.errorMessage : 'Something went wrong!';
              this.error = this.error.replace(/,/g, '<br/>');
            }
          } else {
            this.error = 'Something went wrong!';
          }
        }
      }, err => {
        this.error = err;
      });

  }

  resetUploadInfo() {
    this.message = '';
    this.error = '';
    this.percentDone = 0;
  }

  public onChangeLocationType(event) {
    if (this.selectedLocationType === this.WarehouseLabel) {

    }

    if (this.selectedLocationType === this.StoreLabel) {
      this.selectedStore = null;
    }
  }

  private getLocations() {
    this.isLocationsLoading = true;

    this.locationService.getAllWithoutPaging().subscribe(res => {
      this.wareHouses = res.filter(x => x.type === LocationType.wareHouse);
      this.stores = res.filter(x => x.type === LocationType.store);

      this.isLocationsLoading = false;
    });
  }
}

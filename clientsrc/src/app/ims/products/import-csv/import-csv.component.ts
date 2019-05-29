import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpEventType } from '@angular/common/http';
import { zip } from 'rxjs';
import { ProductService } from 'src/app/shared/services/product.service';
import { checkJsonString } from 'src/app/shared/utils/JSON.util';
import { Store, select } from '@ngrx/store';
import * as fromProduct from '../state';
import * as productActions from '../state/product.actions';
import { PagingFilterCriteria } from 'src/app/shared/base-model/paging-filter-criteria';

@Component({
  selector: 'app-import-csv',
  templateUrl: './import-csv.component.html',
  styleUrls: ['./import-csv.component.scss']
})
export class ImportCSVComponent implements OnInit {

  constructor(
    private activeModal: NgbActiveModal,
    private productService: ProductService,
    private store: Store<fromProduct.State>,
  ) {

  }

  selectedFiles!: FileList;
  currentFileUpload!: File | null;
  public isUploading = false;
  public message = '';
  public error = '';
  public percentDone = 0;
  pageSize = 10;

  ngOnInit() {
  }

  selectFile(event: { target: { files: FileList; }; }) {
    this.selectedFiles = event.target.files;
    if (this.selectedFiles !== null) {
      this.currentFileUpload = this.selectedFiles.item(0);
    }
    this.resetUploadInfo();
  }

  upload() {
    this.isUploading = true;
    this.resetUploadInfo();

    const uploadCSV$ = this.productService.uploadCSV(this.currentFileUpload).subscribe((event: any) => {
      if (event.type === HttpEventType.UploadProgress) {
        this.percentDone = Math.round(100 * (event.loaded + event.loaded) / (event.total + event.total));
      } else if (event.partialText) {
        this.isUploading = false;
        if (checkJsonString(event.partialText)) {
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
      this.store.dispatch(new productActions.GetProducts(new PagingFilterCriteria(1, this.pageSize), ''));
    }, err => {
      this.error = err;
    });
  }

  onClose(): void {
    this.activeModal.close('closed');
  }

  onDismiss(reason: String): void {
    this.activeModal.dismiss(reason);
  }

  resetUploadInfo() {
    this.message = '';
    this.error = '';
    this.percentDone = 0;
  }

}

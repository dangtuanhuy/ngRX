import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Component } from '@angular/core';
import { BrandService } from 'src/app/shared/services/brand.service';
import { HttpEventType } from '@angular/common/http';
import { checkJsonString } from 'src/app/shared/utils/JSON.util';
import * as fromBrand from '../state/brand.reducer';
import { Store } from '@ngrx/store';
import { PagingFilterCriteria } from 'src/app/shared/base-model/paging-filter-criteria';
import * as brandActions from '../../brands/state/brand.action';

@Component({
    selector: 'app-import-brand',
    templateUrl: './import-brand.component.html',
    styleUrls: ['./import-brand.component.scss']
})

export class ImportBrandComponent {
    constructor(private activeModal: NgbActiveModal,
        private brandService: BrandService,
        private store: Store<fromBrand.BrandState>) {
    }

    selectedFiles!: FileList;
    currentFileUpload!: File | null;
    public isUploading = false;
    public message = '';
    public error = '';
    public percentDone = 0;
    pageSize = 10;

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

        this.brandService.import(this.currentFileUpload).subscribe((event: any) => {
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
            this.store.dispatch(new brandActions.GetBrands(new PagingFilterCriteria(1, this.pageSize), ''));
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

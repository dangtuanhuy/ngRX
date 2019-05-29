import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/shared/services/product.service';
import { HttpEventType } from '@angular/common/http';
import { checkJsonString } from 'src/app/shared/utils/JSON.util';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-product-format-file',
  templateUrl: './product-format-file.component.html',
  styleUrls: ['./product-format-file.component.scss']
})
export class ProductFormatFileComponent implements OnInit {
  public inputFolderPath = '';
  public outputFolderPath = '';
  selectedFiles: File[] = [];

  public isUploading = false;
  public message = '';
  public error = '';
  public percentDone = 0;

  constructor(
    private productService: ProductService,
    private activeModal: NgbActiveModal
  ) { }

  ngOnInit() {
  }

  public selectFile(event: { target: { files: FileList; }; }) {
    const rawFiles = event.target.files;
    this.selectedFiles = [];
    for (let i = 0; i < rawFiles.length; i++) {
      this.selectedFiles.push(rawFiles.item(i));
    }
    this.resetUploadInfo();
  }

  upload() {
    this.isUploading = true;
    this.resetUploadInfo();

    this.productService.formatCSVs(this.selectedFiles).subscribe((data: any) => {
      this.isUploading = false;
      const blob = new Blob([data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);

      if (navigator.msSaveOrOpenBlob) {
        navigator.msSaveBlob(blob, 'FormatedProduct.csv');
      } else {
        const a = document.createElement('a');
        a.href = url;
        a.download = 'FormatedProduct.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
      window.URL.revokeObjectURL(url);
    }, err => {
      this.error = err;
    });
  }

  resetUploadInfo() {
    this.message = '';
    this.error = '';
    this.percentDone = 0;
  }

  onClose(): void {
    this.activeModal.close('closed');
  }

  onDismiss(reason: String): void {
    this.activeModal.dismiss(reason);
  }
}

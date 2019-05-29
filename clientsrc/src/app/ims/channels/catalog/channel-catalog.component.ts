import { Component, ViewChild, ViewEncapsulation, Injector, ElementRef } from '@angular/core';
import { ComponentBase } from 'src/app/shared/components/component-base';
import { ChannelService } from 'src/app/shared/services/channel.service';
import { Store, select } from '@ngrx/store';
import * as fromChannel from '../state/channel.reducer';
import * as channelSelector from '../state/index';
import { takeWhile } from 'rxjs/operators';
import { CatalogModel } from './channel-catalog.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PagingFilterCriteria } from 'src/app/shared/base-model/paging-filter-criteria';
import { fromEvent } from 'rxjs';

@Component({
    selector: 'app-catalog-channel',
    templateUrl: './channel-catalog.component.html',
    styleUrls: ['./channel-catalog.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class ChannelCatalogComponent extends ComponentBase {
    private componentActive = true;
    public channelId: string;
    public datasource: any[] = [];
    public pageNumberProduct: number;
    public pageSizeProduct: number;
    public totalItemProduct: number;
    public searchText = '';
    @ViewChild('catalogTable') table: any;
    @ViewChild('searchInput')
    searchInput!: ElementRef;
    fieldValues: any;
    columnCount = 0;

    public filterData: CatalogModel[] = [];

    constructor(private channelService: ChannelService,
        private store: Store<fromChannel.ChannelState>,
        private activeModal: NgbActiveModal,
        public injector: Injector) {
        super(injector);
        this.pageNumberProduct = 0;
        this.pageSizeProduct = 10;
        this.totalItemProduct = 0;

    }

    onInit() {
        this.handleSubscription(this.store.pipe(
            select(channelSelector.getSelectedItem), takeWhile(() => this.componentActive))
            .subscribe(
                (id: string) => {
                    if (id == null) {
                        return;
                    }
                    this.getCata(id, this.pageNumberProduct, this.searchText);
                }
            ));
        this.addKeyUpEventToSearchText();
    }
    onDestroy() {
    }

    onClose(): void {
        this.activeModal.close('closed');
    }

    onDismiss(reason: String): void {
        this.activeModal.dismiss(reason);
    }

    getCata(channelId: string, page: number, searchText: string) {
        this.channelId = channelId;
        this.channelService.getCatalog(channelId, searchText, page, this.pageSizeProduct).subscribe(result => {
            const temp = result;
            this.pageNumberProduct = temp.currentPage - 1;
            this.pageSizeProduct = temp.numberItemsPerPage;
            this.totalItemProduct = temp.totalItems;
            this.datasource = temp.data;
        });
    }

    addKeyUpEventToSearchText() {
        fromEvent(this.searchInput.nativeElement, 'keyup')
            .subscribe(() => {
                this.pageNumberProduct = 0;
                this.getCata(this.channelId, this.pageNumberProduct, this.searchText);
            });
    }

    changeSelectedPage(pageInfo: { offset: number; }) {
        this.datasource = [];
        const nextPage = pageInfo.offset + 1;
        this.getCata(this.channelId, nextPage, this.searchText);
      }

    filter(products: any) {
        this.filterData = [];
        products.forEach(product => {
            product.variants.forEach(variant => {
                if (variant) {
                    this.fieldValues = variant.fields;
                    this.columnCount = this.fieldValues.length;
                }
            });
        });
    }

    toggleExpandRow(row) {
        this.table.rowDetail.toggleExpandRow(row);
    }

    onDetailToggle(event) {
    }

    getFieldValue(variants: any) {
        if (variants && variants.length > 0) {
            return variants[0].fields;
        }
    }

    getColumnCount(fields: any) {
        if (fields) {
            return fields.length;
        }
    }
}

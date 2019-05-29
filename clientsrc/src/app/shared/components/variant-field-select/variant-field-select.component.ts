import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { VariantModel } from 'src/app/purchaseorder/purchase-orders/purchase-order.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-variant-field-select',
    templateUrl: './variant-field-select.component.html',
    styleUrls: ['./variant-field-select.component.scss']
})

export class VariantFieldSelectComponent implements OnInit {
    @Input() variants: VariantModel[];
    @Input() variant: VariantModel;
    @Input() variantId: string;
    @Input() isVariantsLoading: boolean;

    @Output() variantIdSelected: EventEmitter<string> = new EventEmitter();

    pageSize = 10;

    constructor(private activeModal: NgbActiveModal) {}

    ngOnInit() {
    }

    onSelectedVariantChange(variantId: string) {
        this.variantIdSelected.emit(variantId);
    }

    onSelect(selectVariant: VariantModel) {
        this.activeModal.close(selectVariant);
    }

    onDismiss(reason: String): void {
        this.activeModal.dismiss(reason);
    }

}

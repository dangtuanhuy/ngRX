import { NgModule } from '@angular/core';
import { KeyboardDirective } from './directives/keyboard.directive';
import { DenominationsTableComponent } from './components/denominations-table/denominations-table.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputWithKeyboardComponent } from './components/input-with-keyboard/input-with-keyboard.component';
import { SearchWithKeyboardComponent } from './components/search-with-keyboard/search-with-keyboard.component';
import { MasterDetailListViewComponent } from './components/master-detail-list-view/master-detail-list-view.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        NgxDatatableModule
    ],
    declarations: [
        DenominationsTableComponent,
        KeyboardDirective,
        InputWithKeyboardComponent,
        SearchWithKeyboardComponent,
        MasterDetailListViewComponent
    ],
    exports: [
        DenominationsTableComponent,
        KeyboardDirective,
        InputWithKeyboardComponent,
        SearchWithKeyboardComponent,
        MasterDetailListViewComponent
    ]
})
export class PosCommonModule { }

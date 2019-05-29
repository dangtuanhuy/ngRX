import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextFieldComponent } from '../fields/text-field/text-field.component';
import { CheckBoxFieldComponent } from '../fields/check-box-field/check-box-field.component';
import { NumericFieldComponent } from './numeric-field/numeric-field.component';
import { TagFieldComponent } from './tag-field/tag-field.component';
import { TagInputModule } from 'ngx-chips';
import { DropdownListFieldComponent } from './dropdown-list-field/dropdown-list-field.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { RichTextFieldComponent } from './rich-text-field/rich-text-field.component';
import { NgxEditorModule } from 'ngx-editor';
import { EntityRefenceFieldComponent } from './entity-reference-field/entity-reference-field.component';
import { ListEntityReferenceComponent } from './list-entity-reference/list-entity-reference.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { DateTimeFieldComponent } from './date-time-field/date-time-field.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TagInputModule,
        NgxEditorModule,
        NgxDatatableModule,
        NgMultiSelectDropDownModule.forRoot(),
        CommonModule,
        SharedModule,
        NgSelectModule,
        NgbModule
    ],
    exports: [
        TextFieldComponent,
        CheckBoxFieldComponent,
        NumericFieldComponent,
        TagFieldComponent,
        DropdownListFieldComponent,
        RichTextFieldComponent,
        EntityRefenceFieldComponent,
        DateTimeFieldComponent
    ],
    declarations: [
        TextFieldComponent,
        CheckBoxFieldComponent,
        NumericFieldComponent,
        TagFieldComponent,
        DropdownListFieldComponent,
        RichTextFieldComponent,
        EntityRefenceFieldComponent,
        ListEntityReferenceComponent,
        DateTimeFieldComponent,
    ],
    providers: [
    ],
    entryComponents: [
        ListEntityReferenceComponent
    ]
})
export class FieldSharedModule {

}

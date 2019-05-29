import { Component } from '@angular/core';
import { FieldBaseComponent } from '../field-base/field-base.component';

@Component({
    selector: 'app-rich-text-field',
    templateUrl: './rich-text-field.component.html',
    styleUrls: ['./rich-text-field.component.scss']
})

export class RichTextFieldComponent extends FieldBaseComponent<string[]> {

    editorConfig = {
        'editable': true,
        'spellcheck': true,
        'height': 'auto',
        'minHeight': '150px',
        'width': 'auto',
        'minWidth': '0',
        'translate': 'yes',
        'enableToolbar': true,
        'showToolbar': true,
        'placeholder': 'Enter text here...',
        'imageEndPoint': '',
        'toolbar': [
            ['bold', 'italic', 'underline', 'strikeThrough', 'superscript', 'subscript'],
            ['fontName', 'fontSize', 'color'],
            ['justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull', 'indent', 'outdent'],
            ['link']
        ]
    };
    GetValue(value: any): string[] {
        return value;
    }
    Validate(): boolean {
        return true;
    }
    constructor() {
        super();
    }
}

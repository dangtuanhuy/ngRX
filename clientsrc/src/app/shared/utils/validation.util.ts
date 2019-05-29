import { AbstractControl, FormControl } from '@angular/forms';

export function blankSpaceValidator(control: AbstractControl): { [nospace: string]: boolean } | null {
    const regex = /^([\s]+)$/;
    if (control.value && control.value.match(regex)) {
        return { nospace: true };
    }
    return null;
}

export class GeneralValidation {
    static PHONE_REGEX = '^[a-zA-Z0-9 +()-]+$';
    static NUMBER_REGEX = '^[0-9]*$';
}

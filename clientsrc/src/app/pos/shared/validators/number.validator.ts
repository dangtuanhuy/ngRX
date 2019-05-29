const keyValidator = new RegExp(/^([0-9+-.])$/);
const numberValidator = new RegExp(/^[+-]?([0-9]*[.])?[0-9]*$/);

export class NumberValidator {

    public static validateKey(value: any) {
        return keyValidator.test(value);
    }

    public static validateNumber(value: any) {
        return numberValidator.test(value);
    }
}

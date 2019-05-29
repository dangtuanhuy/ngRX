export class ListViewColumn {
    name = '';
    width = '';
    isEdit = false;
    isNumber = false;
    isDecimalNumber = false;
    isIcon = false;

    constructor(values: Object = {}) {
        if (values) {
            Object.assign(this, values);
        }
    }
}

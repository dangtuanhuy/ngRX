export class ShortcutModel {
    id: string;
    key: string;
    name: string;
    page: string;
    shortcut: string;

    constructor(values: Object = {}) {
        if (values) {
            Object.assign(this, values);
        }
    }
}

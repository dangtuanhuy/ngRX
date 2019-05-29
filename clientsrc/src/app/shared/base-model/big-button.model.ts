export class BigButton {
    id: string;
    title: string;
    caption: string;
    width: number;
    height: number;
    backgroundColor: string;
    textColor: string;
    fontSize: string;
    colspan: number;
    shortKey: string;

    constructor(values: Object = {}) {
        if (values) {
            Object.assign(this, values);
        }
    }
}

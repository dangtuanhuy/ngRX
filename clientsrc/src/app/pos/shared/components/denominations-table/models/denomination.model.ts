export class Denomination {
    id: string;
    name: string;
    value: number;

    constructor(values: Object = {}) {
        if (values) {
            Object.assign(this, values);
        }
    }
}

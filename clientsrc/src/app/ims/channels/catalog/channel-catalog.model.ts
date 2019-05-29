export class CatalogModel {
    id: string;
    name: string;
    description: string;
    variant: string;
    constructor(data: any) {
        this.id = data.id;
        this.name = data.name;
        this.description = data.description;
        this.variant = data.variant;
    }
}

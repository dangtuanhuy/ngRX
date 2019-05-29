export class LocationModel {
    public id: string;
    public name: string;
    public address: string;
    public locationCode: string;
    public contactPerson: string;
    public phone1: string;
    public phone2: string;
    public type: LocationType;
    public createdDate?: string;
    public createdBy?: string;
    public updatedDate?: string;
    public updatedBy?: string;

    constructor(object?: any) {
        if (object) {
            this.id = object.id;
            this.name = object.name;
            this.address = object.address;
            this.locationCode = object.locationCode;
            this.type = object.type;
            this.contactPerson = object.contactPerson;
            this.phone1 = object.phone1;
            this.phone2 = object.phone2;
            this.createdBy = object.createdBy;
            this.createdDate = object.createdDate;
            this.updatedBy = object.updatedBy;
            this.updatedDate = object.updatedDate;
        }
    }
}

export class LocationViewModel extends LocationModel {
    locationType: string;
    constructor(model: LocationModel) {
        super();
        this.id = model.id;
        this.name = model.name;
        this.address = model.address;
        this.locationCode = model.locationCode;
        this.locationType = model.type === LocationType.wareHouse ? 'Warehouse' : 'Store';
        this.contactPerson = model.contactPerson;
        this.phone1 = model.phone1;
        this.phone2 = model.phone2;
        this.createdBy = model.createdBy;
        this.createdDate = model.createdDate;
        this.updatedBy = model.updatedBy;
        this.updatedDate = model.updatedDate;
    }
}

export enum LocationType {
    wareHouse = 1,
    store = 2
}


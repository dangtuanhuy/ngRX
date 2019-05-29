export class VendorModel {
    id: string;
    vendorCode: string;
    name: string;
    description: string;
    address1: string;
    address2: string;
    email: string;
    vendorUrl: string;
    barCode: string;
    country: string;
    cityCode: string;
    cityName: string;
    taxTypeId: string;
    paymentTermName: string;
    currencyName: string;
    taxTypeName: string;
    phone: string;
    paymentTermId: string;
    currencyId: string;
    zipCode: string;
    fax: string;
    attention: string;
    active: boolean;
}

export class VendorViewModel {
    id: string;
    vendorCode: string;
    name: string;
    description: string;
    address1: string;
    address2: string;
    email: string;
    vendorUrl: string;
    barCode: string;
    country: string;
    phone: string;
    paymentTermId: string;
    currencyId: string;
    paymentTermName: string;
    currencyName: string;
    cityCode: string;
    cityName: string;
    taxTypeId: string;
    taxTypeName: string;
    zipCode: string;
    fax: string;
    attention: string;
    active: boolean;
    updatedDate: string;
    createdDate: string;
    constructor(data: any) {
        this.id = data.id;
        this.name = data.name;
        this.description = data.description;
        this.vendorCode = data.vendorCode;
        this.address1 = data.address1;
        this.address2 = data.address2;
        this.email = data.email;
        this.vendorUrl = data.vendorUrl;
        this.barCode = data.barCode;
        this.country = data.country;
        this.phone = data.phone;
        this.paymentTermName = data.paymentTermName;
        this.currencyName = data.currencyName;
        this.cityCode = data.cityCode;
        this.cityName = data.cityName;
        this.taxTypeName = data.taxTypeName;
        this.zipCode = data.zipCode;
        this.fax = data.fax;
        this.attention = data.attention;
        this.active = data.active;
        this.updatedDate = data.updatedDate;
        this.createdDate = data.createdDate;
    }
}

export class PaymentTermModel {
    id: string;
    name: string;
    code: string;
    description: string;
}


export class VendorFilterRequestModel {
    paymentTermIds: string[];
    currencyIds: string[];
    taxTypeIds: string[];
    queryString: string;
    constructor() {
        this.paymentTermIds = [];
        this.currencyIds = [];
        this.taxTypeIds = [];
        this.queryString = '';
    }
}




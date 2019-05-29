import { FieldType } from './field-base/field-type';
import { checkJsonString } from 'src/app/shared/utils/JSON.util';

export class FieldModel {
    constructor(item: any) {
        this.id = item.id;
        this.name = item.name;
        this.description = item.description;
        this.defaultValue = item.defaultValue;
        this.type = item.type;
        this.identifiedId = item.identifiedId;
    }
    id: string;
    name: string;
    description: string;
    defaultValue: string;
    type: string;
    identifiedId: string;

}

export class EntityRefModel {
    constructor(item: any) {
        this.id = item.id;
        this.name = item.name;
        this.namespace = item.namespace;
    }

    id: string | undefined;
    name: string | undefined;
    namespace: string | undefined;
}

export class PredefineModel {
    constructor(item: any) {
        this.display = item.display;
        this.value = item.value;
    }

    display: string | undefined;
    value: string | undefined;
}

export class FieldValueModel {
    constructor(item: any) {
        this.type = item.type;
        this.id = item.id;
        this.name = item.name;
        this.value = item.value;
        this.data  = item.data;
    }
    type: string;
    id: string;
    name: string;
    value: string;
    data: [];
}


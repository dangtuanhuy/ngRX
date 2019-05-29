import { FieldType } from './field-type';

export interface FieldValue<TValue> {
    id: string;
    fieldId: string;
    name: string;
    value: TValue;
    type: FieldType;
    data: TValue[];
}

export class ReferenceEntityValue {
    id: string;
    value: string;
}

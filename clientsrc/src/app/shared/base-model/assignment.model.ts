
export class AssignmentModel {
    id: string;
    name: string;
    type: AssignmentType;

    constructor(data: any) {
        this.id = data.id;
        this.name = data.name;
        this.type = data.type;
    }
}

export class AddAssignmentModel {
    referenceId: string;
    entityType: AssignmentType;
    constructor(data: any) {
        this.referenceId = data.id;
        this.entityType = data.type;
    }
}

export enum AssignmentType {
    product = 1,
    category = 2,
}

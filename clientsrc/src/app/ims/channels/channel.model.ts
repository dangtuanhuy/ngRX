export class ChannelModel {
    id: string;
    name: string;
    description: string;
    serverInformation: string;
    isProvision: boolean;
}

export class AddChannelStoreAssignmentModel {
    storeId: string;

    constructor(data: any) {
        this.storeId = data.storeId;
    }
}

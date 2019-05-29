import { DeviceCommand } from '../../enums/device-hub/device-command.enum';

export class DeviceHubRequest {
    command: DeviceCommand;
    deviceHubName: string;
    data: string;
}

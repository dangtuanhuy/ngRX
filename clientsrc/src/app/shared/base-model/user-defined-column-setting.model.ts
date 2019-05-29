import { environment } from 'src/environments/environment';

export class UserDefinedColumnSetting {
    key: string;
    defaultValue: string;
    apiUrl: string;
    constructor(key: string, defaultValue: string, apiUrl: string) {
        this.key = key;
        this.defaultValue = defaultValue;
        this.apiUrl = apiUrl;
    }
}

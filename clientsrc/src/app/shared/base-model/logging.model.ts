export class LogEntry {
    logLevel: LogLevel;
    message: string;
    application: Application;
    constructor(data: any) {
        this.logLevel = data.logLevel;
        this.message = data.message;
        this.application = data.application;
    }
}

export enum LogLevel {
    Trace = 0,
    Debug = 1,
    Information = 2,
    Warning = 3,
    Error = 4,
    Critical = 5,
    None = 6
}

export enum Application {
    PIM = 1,
    PurchaseOrder = 2,
    Retail = 3,
    Promotion = 4,
    Pos = 5
}


export enum ActivatedScreen {
    None = 0,
    // tslint:disable-next-line:no-bitwise
    Sale = 1 << 0,
    // tslint:disable-next-line:no-bitwise
    QuickSelect = 1 << 1,
    // tslint:disable-next-line:no-bitwise
    All = ~(~0 << 2)
}

export enum SyncedDataFlag {
    None = 0,
    // tslint:disable-next-line:no-bitwise
    Customer = 1 << 0,
    // tslint:disable-next-line:no-bitwise
    User = 1 << 1,
    // tslint:disable-next-line:no-bitwise
    Category = 1 << 2,
    // tslint:disable-next-line:no-bitwise
    Product = 1 << 3,
    // tslint:disable-next-line:no-bitwise
    Variant = 1 << 4,
    // tslint:disable-next-line:no-bitwise
    Promotion = 1 << 5,
    // tslint:disable-next-line:no-bitwise
    BarCode = 1 << 6,
    // tslint:disable-next-line:no-bitwise
    SaleTarget = 1 << 7,
    // tslint:disable-next-line:no-bitwise
    Store = 1 << 8,
    // tslint:disable-next-line:no-bitwise
    PaymentMethod = 1 << 9,
    // tslint:disable-next-line:no-bitwise
    Location = 1 << 10,
    // tslint:disable-next-line:no-bitwise
    VariantStockBalance = 1 << 11,
    // tslint:disable-next-line:no-bitwise
    All = ~(~0 << 12)
}

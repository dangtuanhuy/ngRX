export const CommonConstants = {
    contentPageWidth: 720
};

export const PageConstants = {
    defaultPage: 'quick-select',
    quickSelect: 'quick-select',
    payment: 'payment',
    openDay: 'open-day',
    closeDay: 'close-day',
    appSetting: 'appSetting',
    stockPrice: 'stock-price',
    federateSearchStock: 'federate-search-stock',
    customerManagement: 'customer-management',
    recentSales: 'recent-sales',
    pendingSales: 'pending-sales',
    pickupOrder: 'pickup-order',
    login: 'login',
    deviceAuthentication: 'device-authentication',
    syncData: 'sync-data',
    receipt: 'receipt',
    promotion: 'promotion'
};

export const PageInputId = {
    login: {
        prefix: '',
        inputIds: {
            email: 'login-email',
            password: 'login-password'
        }
    },
    deviceAuthentication: {
        inputIds: {
            deviceCode: 'device-authentication-deviceCode'
        }
    },
    sales: {
        inputIds: {
            customerSearch: 'sales-customer-search',
            productSearch: 'login-product-search'
        }
    },
    openDay: {
        prefix: 'open-day',
    },
    closeDay: {
        prefix: 'close-day',
    },
    recentSales: {
        inputIds: {
            saleSearch: 'recentSales-sale-search'
        }
    },
    pickupOrders: {
        inputIds: {
            orderSearch: 'pickupOrders-order-search'
        }
    },
    pendingSales: {
        inputIds: {
            saleSearch: 'pendingSales-sale-search'
        }
    },
    denomination: {
        prefix: 'denomination'
    },
    customerManagement: {
        inputIds: {
            customerSearch: 'customer-management-search'
        }
    },
    payment: {
        inputIds: {
            paymentModeSearchId: 'payment-paymentMode-search'
        }
    },
    shortcut: {
        inputIds: {
            syncIntervalTime: 'shortcut-sync-interval-time',
            GST: 'shortcut-GST',
            deviceHubName: 'shortcut-device-hub-name',
            printerShareName: 'shortcut-printer-share-name',
            billNoPrefix: 'shortcut-billNo-prefix',
            billNoDeviceNo: 'shortcut-billNo-device-no'
        }
    },
    stockPrice: {
        inputIds: {
            searchProductInput: 'stock-price-search-product-input'
        }
    },
    federateStockPrice: {
        inputIds: {
            searchProductInput: 'federate-stock-price-search-product-input'
        }
    },
    promotion: {
        pages: {
            manualDiscount: {
                inputIds: {
                    manualDiscountValue: 'promotion-manual-discount-value'
                },
            },
            variantDiscount: {
                inputIds: {
                    variantDiscountValue: 'promotion-variant-discount-value'
                },
            }
        }
    }
};

export enum KeyboardKey {
    Alt = 'Alt',
    AltGr = 'AltGraph',
    AltLk = 'AltLk',
    Bksp = 'Backspace',
    Caps = 'CapsLock',
    Enter = 'Enter',
    Shift = 'Shift',
    Space = ' ',
    Tab = 'Tab',
    Control = 'Control'
}

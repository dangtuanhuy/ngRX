import * as fromRoot from 'src/app/shared/state/app.state';
import { SaleActions, SaleActionTypes } from './sales.action';
import { CustomerModel } from 'src/app/shared/base-model/customer.model';
import { ProductViewModel } from '../../shared/models/product-view.model';
import { PosFormActionStatus } from '../../shared/constants/pos-form-action.constant';
import { Promotion } from '../../shared/models/promotion';
import { SaleItemViewModel, calculateSaleItemsTotalPrice } from '../../shared/view-models/sale-item.view-model';
import { SaleItemType } from '../../shared/enums/sale-item-type.enum';
import { DiscountType } from '../../shared/enums/discount-type.enum';
import { PriceExtension } from '../../shared/helpers/price.extension';
import { Variant } from '../../shared/models/variant';


export interface State extends fromRoot.State {
    sales: SalesState;
}

export interface SalesState {
    customer: CustomerModel;
    products: ProductViewModel[];
    promotions: Promotion[];
    saleItemViewModels: SaleItemViewModel[];
    status: {
        value: PosFormActionStatus,
        data: any
    };
    GST: number;
    GSTInclusive: boolean;
}

const initialState: SalesState = {
    customer: null,
    products: [],
    promotions: [],
    saleItemViewModels: [],
    status: {
        value: PosFormActionStatus.None,
        data: null
    },
    GST: 0,
    GSTInclusive: false
};

export function reducer(state = initialState, action: SaleActions): SalesState {
    switch (action.type) {
        case SaleActionTypes.AddSaleItem: {
            return AddSaleItem(state, action.payload);
        }
        case SaleActionTypes.UpdateProductQuantity: {
            return UpdateProductQuantity(state, action.payload);
        }
        case SaleActionTypes.SelectCustomer: {
            const saleProductItems = state.saleItemViewModels.filter(x => x.type === SaleItemType.Product);
            const salePromotionItems = state.saleItemViewModels.filter(x => x.type === SaleItemType.Promotion);
            let newSaleItems = state.saleItemViewModels;

            if (!state.customer) {
                newSaleItems = [];
                const products = state.products;
                products.forEach(product => {
                    product.price = product.memberPrice;
                    product.amount = product.price * product.quantity;
                    const selectedSaleItem = saleProductItems.find(x => x.id === product.id);
                    if (selectedSaleItem) {
                        selectedSaleItem.price = product.memberPrice;
                        selectedSaleItem.amount = selectedSaleItem.quantity * selectedSaleItem.price;

                        newSaleItems.push(selectedSaleItem);
                    }
                });

                const saleProductItemsTotalPrice = calculateSaleItemsTotalPrice(newSaleItems);
                const promotions = state.promotions;
                promotions.forEach(promotion => {
                    const selectedSaleItem = salePromotionItems.find(x => x.id === promotion.id);
                    if (selectedSaleItem) {
                        if (promotion.discountTypeId === DiscountType.Money) {
                            selectedSaleItem.price = -1 * promotion.value;
                        }

                        if (promotion.discountTypeId === DiscountType.Percent) {
                            selectedSaleItem.price = -1 * (saleProductItemsTotalPrice * Number(promotion.value)) / 100;
                        }

                        newSaleItems.push(selectedSaleItem);
                    }
                });
            }

            return {
                ...state,
                customer: action.payload,
                saleItemViewModels: [...newSaleItems]
            };
        }
        case SaleActionTypes.ReleasePendingSaleSuccess: {
            state.products = [];
            state.promotions = [];
            state.saleItemViewModels = [];
            state.customer = action.payload.customer;
            const variants: Variant[] = action.payload.variants;
            const pendingSaleItems = action.payload.pendingSaleItems;

            variants.forEach(variant => {
                const seletedPendingSale = pendingSaleItems.find(x =>
                    x.stockTypeId === variant.stockTypeId
                    && x.variantId === variant.variantId
                    && x.priceId === variant.priceId
                );
                const quantity = seletedPendingSale ? seletedPendingSale.quantity : 1;
                AddSaleItem(state, variant, quantity);
            });

            return {
                ...state,
                customer: state.customer,
                products: [...state.products],
                promotions: [...state.promotions],
                saleItemViewModels: [...state.saleItemViewModels]
            };
        }
        case SaleActionTypes.ClearData: {
            return {
                ...state,
                customer: null,
                products: [],
                promotions: [],
                saleItemViewModels: []
            };
        }
        case SaleActionTypes.AddSaleSucess || SaleActionTypes.AddPendingSaleSucess: {
            const order = action.payload;
            return {
                ...state,
                status: {
                    value: PosFormActionStatus.Success,
                    data: order.id
                },
                customer: null,
                products: [],
                saleItemViewModels: [],
                promotions: []
            };
        }
        case SaleActionTypes.SetStatus: {
            return {
                ...state,
                status: action.payload
            };
        }
        case SaleActionTypes.SetGST: {
            return {
                ...state,
                GST: action.payload
            };
        }
        case SaleActionTypes.SetGSTInclusive: {
            return {
                ...state,
                GSTInclusive: action.payload
            };
        }
        case SaleActionTypes.AddPromotion: {
            state.promotions.push(action.payload);
            buildSaleItemViewModels(state);
            return {
                ...state,
                promotions: [...state.promotions],
                saleItemViewModels: [...state.saleItemViewModels]
            };
        }
        case SaleActionTypes.DeleteSaleItem: {
            let finished = false;
            const products = state.products;
            for (let i = 0; i < products.length && !finished; i++) {
                const product = products[i];
                if (product.id === action.payload) {
                    finished = true;
                    return DeleteProduct(state, action.payload);
                }

                const saleItemPromotions = product.saleItemPromotions;
                if (Array.isArray(saleItemPromotions)) {
                    const selectedSaleItemPromotion = saleItemPromotions.find(x => x.id === action.payload);
                    if (selectedSaleItemPromotion) {
                        finished = true;
                        return DeleteSaleItemPromotion(state, product.id, selectedSaleItemPromotion.id);
                    }
                }

            }

            const promotion = state.promotions.find(x => x.id === action.payload);
            if (promotion) {
                return DeletePromotion(state, action.payload);
            }

            return state;
        }
        case SaleActionTypes.AddSaleItemPromotion: {
            const selectedProduct = state.products.find(x => x.id === action.payload.selectedPosVariantId);
            if (!Array.isArray(selectedProduct.saleItemPromotions)) {
                selectedProduct.saleItemPromotions = [];
            }

            selectedProduct.saleItemPromotions.push(action.payload);
            buildSaleItemViewModels(state);

            return {
                ...state,
                saleItemViewModels: [...state.saleItemViewModels]
            };
        }
        default:
            return state;
    }
}

function AddSaleItem(state: SalesState, payload: any, quantity = 1) {
    const products = state.products;
    const existedProduct = products.find(x => x.id === payload.id);
    if (existedProduct) {
        existedProduct.quantity++;
        existedProduct.amount = existedProduct.price * existedProduct.quantity;
    } else {
        const newProduct: ProductViewModel = Object.assign({}, payload);
        newProduct.price = state.customer ? payload.memberPrice : payload.listPrice;
        newProduct.amount = newProduct.price;
        newProduct.quantity = quantity;
        products.push(newProduct);
    }
    state.products = products;

    buildSaleItemViewModels(state);

    return {
        ...state,
        products: [...state.products],
        saleItemViewModels: [...state.saleItemViewModels]
    };
}

function DeleteProduct(state: SalesState, payload: any) {
    const products = state.products;
    const deletedIndex = products.findIndex(x => x.id === payload);
    if (deletedIndex > -1) {
        products.splice(deletedIndex, 1);
    }
    state.products = products;
    buildSaleItemViewModels(state);

    return {
        ...state,
        products: [...state.products],
        saleItemViewModels: [...state.saleItemViewModels]
    };
}

function DeleteSaleItemPromotion(state: SalesState, productId: string, orderItemPromotionId: string) {
    const products = state.products;
    const selectedPromotion = products.find(x => x.id === productId);
    const saleItemPromotions = selectedPromotion.saleItemPromotions;
    const deletedIndex = saleItemPromotions.findIndex(x => x.id === orderItemPromotionId);
    if (deletedIndex > -1) {
        saleItemPromotions.splice(deletedIndex, 1);
    }
    state.products = products;
    buildSaleItemViewModels(state);

    return {
        ...state,
        products: [...state.products],
        saleItemViewModels: [...state.saleItemViewModels]
    };
}

function UpdateProductQuantity(state: SalesState, payload: any) {
    const products = state.products;
    const updatedProduct = products.find(x => x.id === payload.id);
    if (updatedProduct) {
        updatedProduct.quantity = payload.quantity;
        updatedProduct.amount = updatedProduct.price * updatedProduct.quantity;
        buildSaleItemViewModels(state);
    }
    state.products = products;

    return {
        ...state,
        products: [...state.products],
        saleItemViewModels: [...state.saleItemViewModels]
    };
}

function DeletePromotion(state: SalesState, payload: string) {
    const promotions = state.promotions;
    const deletedIndex = promotions.findIndex(x => x.id === payload);
    if (deletedIndex > -1) {
        promotions.splice(deletedIndex, 1);
    }

    buildSaleItemViewModels(state);

    return {
        ...state,
        promotions: [...promotions],
        saleItemViewModels: [...state.saleItemViewModels]
    };
}

function buildSaleItemViewModels(state: SalesState) {
    const products = state.products;
    const promotions = state.promotions;
    const newSaleItemViewModels: SaleItemViewModel[] = [];

    products.forEach(product => {
        const saleItemViewModel = new SaleItemViewModel();
        saleItemViewModel.id = product.id;
        saleItemViewModel.priceId = product.priceId;
        saleItemViewModel.variantId = product.variantId;
        saleItemViewModel.description = product.description;
        saleItemViewModel.skuCode = product.skuCode;
        saleItemViewModel.quantity = product.quantity;
        saleItemViewModel.price = state.customer ? product.memberPrice : product.listPrice;
        saleItemViewModel.amount = saleItemViewModel.price * saleItemViewModel.quantity;
        saleItemViewModel.type = SaleItemType.Product;

        newSaleItemViewModels.push(saleItemViewModel);

        const orderItemPromotions = product.saleItemPromotions;
        if (Array.isArray(orderItemPromotions)) {
            orderItemPromotions.forEach(orderItemPromotion => {
                const saleItemViewModelOfItemPromotion = new SaleItemViewModel();
                saleItemViewModelOfItemPromotion.id = orderItemPromotion.id;
                saleItemViewModelOfItemPromotion.description = 'Item discount';

                if (orderItemPromotion.discountType === DiscountType.Money) {
                    saleItemViewModelOfItemPromotion.price = -1 * orderItemPromotion.value;
                    saleItemViewModelOfItemPromotion.amount = saleItemViewModelOfItemPromotion.price;
                }
                if (orderItemPromotion.discountType === DiscountType.Percent) {
                    saleItemViewModelOfItemPromotion.description += ` (${orderItemPromotion.value} %)`;
                    saleItemViewModelOfItemPromotion.price =
                        -1 * PriceExtension.round(saleItemViewModel.amount * orderItemPromotion.value / 100, 2);
                    saleItemViewModelOfItemPromotion.amount = saleItemViewModelOfItemPromotion.price;
                }
                saleItemViewModelOfItemPromotion.quantity = 1;
                saleItemViewModelOfItemPromotion.type = SaleItemType.ItemPromotion;

                newSaleItemViewModels.push(saleItemViewModelOfItemPromotion);
            });
        }
    });

    promotions.forEach(promotion => {
        const saleItemViewModel = new SaleItemViewModel();
        saleItemViewModel.id = promotion.id;
        saleItemViewModel.description = promotion.description;
        saleItemViewModel.quantity = 1;
        saleItemViewModel.type = SaleItemType.Promotion;
        if (promotion.discountTypeId === DiscountType.Money) {
            saleItemViewModel.price = -1 * promotion.value;
        }

        if (promotion.discountTypeId === DiscountType.Percent) {
            saleItemViewModel.description += ` (${promotion.value} %)`;
            const saleProductItems = newSaleItemViewModels
                .filter(x => x.type === SaleItemType.Product || x.type === SaleItemType.ItemPromotion);
            const saleProductItemsTotalPrice = calculateSaleItemsTotalPrice(saleProductItems);
            saleItemViewModel.price = -1 * PriceExtension.round(saleProductItemsTotalPrice * promotion.value / 100, 2);
            saleItemViewModel.amount = saleItemViewModel.price;
        }

        newSaleItemViewModels.push(saleItemViewModel);
    });

    state.saleItemViewModels = newSaleItemViewModels;
}

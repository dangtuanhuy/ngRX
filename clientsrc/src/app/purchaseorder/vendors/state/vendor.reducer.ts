import * as fromRoot from 'src/app/shared/state/app.state';
import { VendorActions, VendorActionTypes } from './vendor.action';
import { VendorModel, PaymentTermModel } from '../vendor.model';
import { CurrencyModel, TaxTypeModel } from '../../purchase-orders/purchase-order.model';

export interface State extends fromRoot.State {
  vendors: VendorState;
}

export interface VendorState {
  vendors: VendorModel[];
  vendor: VendorModel;
  currencies: CurrencyModel[];
  paymentTerms: PaymentTermModel[];
  taxTypes: TaxTypeModel[];  
}

const initialState: VendorState = {
  vendors: [],
  vendor: null,
  paymentTerms: [],
  currencies: [],
  taxTypes: [],  
};

export const key = 'vendors_reducer';

export function reducer(
  state = initialState,
  action: VendorActions
): VendorState {
  switch (action.type) {
    case VendorActionTypes.GetVendorsSuccess:
      return {
        ...state,
        vendors: action.payload.data
      };
    case VendorActionTypes.GetVendorSuccess:
      return {
        ...state,
        vendor: action.payload
      };
    case VendorActionTypes.AddVendorSuccess:
      return {
        ...state,
        vendors: [...state.vendors, action.payload]        
      };
    case VendorActionTypes.AddVendorFail: {
      return {
        ...state
      };
    }
    case VendorActionTypes.UpdateVendorSuccess:
      const updatedVendors = state.vendors.map(item =>
        action.payload.id === item.id ? action.payload : item
      );
      return {
        ...state,
        vendors: updatedVendors
      };
    case VendorActionTypes.UpdateVendorFail: {
      return {
        ...state
      };
    }
    case VendorActionTypes.DeleteVendorSuccess:
      return {
        ...state,
        vendors: state.vendors.filter(
          vendor => vendor.id !== action.payload
        )
      };
    case VendorActionTypes.DeleteVendorFail:
      return {
        ...state
      };
    case VendorActionTypes.GetCurrenciesSuccess:
            return {
                ...state,
                currencies: action.payload
            };
     case VendorActionTypes.GetPaymentTermsSuccess:
            return {
                ...state,
                paymentTerms: action.payload
            };

    case VendorActionTypes.GetTaxTypesSuccess:
            return {
                ...state,
                taxTypes: action.payload
            };
    default:
      return state;
  }
}

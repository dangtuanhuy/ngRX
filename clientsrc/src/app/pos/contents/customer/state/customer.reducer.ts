import * as fromRoot from 'src/app/shared/state/app.state';
import { Customer } from 'src/app/pos/shared/models/customer';
import { CustomerActions, CustomerActionTypes } from './customer.action';

export interface State extends fromRoot.State {
    customers: CustomerState;
}

export interface CustomerState {
    customers: Customer[];
    customer: Customer;
    pageInformation: any;
}

const initialState: CustomerState = {
    customers: [],
    customer: null,
    pageInformation: null
};

export function reducer(state = initialState, action: CustomerActions): CustomerState {
    switch (action.type) {
        case CustomerActionTypes.GetCustomers: {
            return state;
        }
        case CustomerActionTypes.UpdateSearchInformation: {

            return {
                ...state,
                pageInformation: action.payload
            };
        }
        case CustomerActionTypes.ClearSearchInformation: {
            return {
                ...state,
                pageInformation: null
            };
        }
        default:
            return state;
    }
}

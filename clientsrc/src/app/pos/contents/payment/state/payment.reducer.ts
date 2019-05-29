import * as fromRoot from 'src/app/shared/state/app.state';
import { PaymentModeActions, PaymentModeActionTypes } from './payment.action';
import { PaymentModeViewModel } from 'src/app/pos/shared/models/payment-mode.model';


export interface State extends fromRoot.State {
    paymentModes: PaymentModeState;
}

export interface PaymentModeState {
    paymentModes: PaymentModeViewModel[];
}

const initialState: PaymentModeState = {
    paymentModes: []
};

export function reducer(state = initialState, action: PaymentModeActions): PaymentModeState {
    switch (action.type) {
        case PaymentModeActionTypes.AddPaymentModeSuccess: {
            return AddPaymentModeSuccess(state, action.payload);
        }
        case PaymentModeActionTypes.DeletePaymentModeByCodeSuccess: {
            return DeletePaymentModeByCodeSuccess(state, action.payload);
        }
        case PaymentModeActionTypes.UpdatePaymentModeAmount: {
            return UpdatePaymentModeAmount(state, action.payload);
        }
        case PaymentModeActionTypes.GetDefaultPaymentModesSuccess: {
            const paymentModeViewModels = action.payload.map(x => {
                const model = new PaymentModeViewModel(x);
                model.amount = 0;
                return model;
            });

            return {
                ...state,
                paymentModes: paymentModeViewModels
            };
        }
        case PaymentModeActionTypes.ClearPaymentModes: {
            state.paymentModes.forEach(x => {
                x.amount = 0;
            });

            return {
                ...state,
                paymentModes: [...state.paymentModes]
            };
        }
        default:
            return state;
    }
}

function AddPaymentModeSuccess(state: PaymentModeState, payload: any) {
    const paymentModes = state.paymentModes;
    const existedpaymentMode = paymentModes.find(x => x.code === payload.code);
    if (existedpaymentMode) {
        return {
            ...state
        };
    } else {
        const newpaymentMode = payload;
        newpaymentMode.amount = 0;
        paymentModes.push(newpaymentMode);
    }

    return {
        ...state,
        paymentModes: [...paymentModes]
    };
}

function DeletePaymentModeByCodeSuccess(state: PaymentModeState, payload: any) {
    const result = payload.result;
    const paymentCode = payload.paymentCode;

    const paymentModes = state.paymentModes;
    if (result) {

        const deletedIndex = paymentModes.findIndex(x => x.code === paymentCode);
        if (deletedIndex > -1) {
            paymentModes.splice(deletedIndex, 1);
        }
    }

    return {
        ...state,
        paymentModes: [...paymentModes]
    };
}

function UpdatePaymentModeAmount(state: PaymentModeState, payload: any) {
    const paymentModes = state.paymentModes;
    const updatedpaymentMode = paymentModes.find(x => x.code === payload.code);
    if (updatedpaymentMode) {
        updatedpaymentMode.amount = payload.amount;
    }

    return {
        ...state,
        paymentModes: [...paymentModes]
    };
}

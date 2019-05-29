import * as fromRoot from 'src/app/shared/state/app.state';
import { TransferInActions, TransferInActionTypes } from './transfer-in.action';
import { InventoryTransactionTransferInModel, InventoryTransactionTransferInViewModel } from '../transfer-in.model';
import { InventoryTransactionTransferOutViewModel } from '../../transfer-out/transfer-out.model';


export interface State extends fromRoot.State {
  inventoryTransactionTransferIns: TransferInState;
}

export interface TransferInState {
    inventoryTransactionTransferIns: InventoryTransactionTransferInViewModel[];
    inventoryTransactionTransferIn: InventoryTransactionTransferInViewModel;
}

const initialState: TransferInState = {
    inventoryTransactionTransferIns: [],
    inventoryTransactionTransferIn: null
};

export const key = 'transfer_in_reducer';

export function reducer(
  state = initialState,
  action: TransferInActions
): TransferInState {
  switch (action.type) {
    case TransferInActionTypes.GetInventoryTransactionTransferInsByLocationSuccess:
      return {
        ...state,
        inventoryTransactionTransferIns: action.payload.data
      };
     case TransferInActionTypes.GetTransferInsSuccess:
      return {
        ...state,
        inventoryTransactionTransferIns: action.payload.data
      };
     case TransferInActionTypes.GetTransferInSuccess:
      return {
        ...state,
        inventoryTransactionTransferIn: action.payload
      };
    default:
      return state;
  }
}

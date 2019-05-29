import * as fromRoot from 'src/app/shared/state/app.state';
import { AssortmentActions, AssortmentActionTypes } from './assortment.action';
import { AssortmentModel } from '../assortment.model';

export interface State extends fromRoot.State {
  assortments: AssortmentState;
}

export interface AssortmentState {
  assortments: AssortmentModel[];
  assortment: AssortmentModel;
}

const initialState: AssortmentState = {
  assortments: [],
  assortment: null
};

export const key = 'assortments_reducer';

export function reducer(
  state = initialState,
  action: AssortmentActions
): AssortmentState {
  switch (action.type) {
    case AssortmentActionTypes.GetAssortmentsSuccess:
      return {
        ...state,
        assortments: action.payload.data
      };
    case AssortmentActionTypes.GetAssortmentSuccess:
      return {
        ...state,
        assortment: action.payload
      };
    case AssortmentActionTypes.AddAssortmentSuccess:
      return {
        ...state,
        assortments: [...state.assortments, action.payload]
      };
    case AssortmentActionTypes.AddAssortmentFail: {
      return {
        ...state
      };
    }
    case AssortmentActionTypes.UpdateAssortmentSuccess:
      const updatedAssortments = state.assortments.map(item =>
        action.payload.id === item.id ? action.payload : item
      );
      return {
        ...state,
        assortments: updatedAssortments
      };
    case AssortmentActionTypes.UpdateAssortmentFail: {
      return {
        ...state
      };
    }
    case AssortmentActionTypes.DeleteAssortmentSuccess:
      return {
        ...state,
        assortments: state.assortments.filter(
          assortment => assortment.id !== action.payload
        )
      };
    case AssortmentActionTypes.DeleteAssortmentFail:
      return {
        ...state
      };
    default:
      return state;
  }
}

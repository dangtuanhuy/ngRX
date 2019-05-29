import {Action} from '@ngrx/store';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { type } from 'os';


export const ADD_INGREDIENT = 'ADD_INGREDIENT';
export class AddInggredient implements Action {
  readonly type = ADD_INGREDIENT;
  payload: Ingredient;
}
export type ShoppingListAction = AddInggredient;

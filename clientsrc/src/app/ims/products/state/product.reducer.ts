import { ProductActionTypes, ProductActions } from './product.actions';
import { ProductModel, ProductListModel, Section, VariantModel } from '../product';
import { Guid } from 'src/app/shared/utils/guid.util';
import { FieldTemplateModel } from '../../field-templates/field-template.model';
import { FieldValue } from '../../fields/field-base/field-value';
import { CategoryModel } from '../../categories/category.model';

export const key = 'products_reducer';

export interface ProductState {
  products: ProductListModel[];
  product: ProductModel;
  variants: VariantModel[];
  fieldTemplates: FieldTemplateModel[];
  categories: CategoryModel[];
  fieldTemplate: ProductModel;
}

const initialState: ProductState = {
  products: [],
  product: {
    id: Guid.empty(),
    name: null,
    description: null,
    sections: [],
    variants: []
  },
  fieldTemplates: [],
  variants: [],
  categories: [],
  fieldTemplate: {
    id: Guid.empty(),
    name: null,
    description: null,
    sections: [],
    variants: []
  }
};

export function reducer(
  state = initialState,
  action: ProductActions
): ProductState {
  switch (action.type) {
    case ProductActionTypes.GetProductsSuccess:
      return {
        ...state,
        products: action.payload.data
      };
    case ProductActionTypes.LoadFromTemplateSuccess:
      return {
        ...state,
        product: action.payload
      };
    case ProductActionTypes.LoadFieldTemplateSuccess:
      return {
        ...state,
        fieldTemplate: action.payload
      };
    case ProductActionTypes.GetProductSuccess:
      return {
        ...state,
        product: action.payload
      };
    case ProductActionTypes.AddProductSuccess:
      return {
        ...state,
        products: [...state.products, action.payload]
      };
    case ProductActionTypes.UpdateProductSuccess:
      const updatedProducts = state.products.map(
        item => action.payload.id === item.id ? action.payload : item);
      return {
        ...state,
        products: updatedProducts
      };
      case ProductActionTypes.DeleteProductSuccess:
          return {
              ...state,
              products: state.products.filter(product => product.id !== action.payload)
          };
      case ProductActionTypes.DeleteProductFail: {
          return {
              ...state
          };
      }
    case ProductActionTypes.SaveField:
      const sections = state.product.sections.map(section => {
        section.fieldValues = section.fieldValues.map(field =>
          action.payload.fieldId === field.fieldId ? action.payload : field
        );
        return section;
      });
      return {
        ...state,
        product: {
          ...state.product,
          sections: sections
        }
      };
    case ProductActionTypes.GetFieldTemplatesSuccess:
      return {
        ...state,
        fieldTemplates: action.payload
      };
    case ProductActionTypes.ChangeFieldValuesRequest:
      return {
        ...state,
        variants: action.payload
      };
    case ProductActionTypes.GetCategoriesSuccess:
      return {
        ...state,
        categories: action.payload
      };
    default:
      return state;
  }
}

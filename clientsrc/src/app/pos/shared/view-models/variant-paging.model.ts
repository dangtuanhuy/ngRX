import { BasePageReponseModel } from './base-page-response.model';
import { VariantModel } from '../models/variant';

export class VariantPagingModel extends BasePageReponseModel {
    variants: VariantModel[];
}

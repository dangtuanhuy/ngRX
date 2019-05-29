import { BasePageReponseModel } from './base-page-response.model';
import { Category } from '../models/category';

export class CategoryPagingModel extends BasePageReponseModel {
    categories: Category[];
}

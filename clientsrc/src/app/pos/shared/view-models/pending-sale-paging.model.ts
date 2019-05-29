import { BasePageReponseModel } from './base-page-response.model';
import { PendingSaleModel } from '../models/pending-sale';

export class PendingSalePagingModel extends BasePageReponseModel {
    pendingSales: PendingSaleModel[];
}

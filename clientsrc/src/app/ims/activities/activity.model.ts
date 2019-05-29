import { PagingFilterCriteria } from 'src/app/shared/base-model/paging-filter-criteria';

export class ActivityModel {
  id: string;
  userName: string;
  iPAddress: string;
  context: string;
  message: string;
  date: Date;
}

export class GetActivityRequestModel {
  userId: string;
  paging: PagingFilterCriteria;
  constructor(userId: string, paging: PagingFilterCriteria) {
    this.userId = userId;
    this.paging = paging;
  }
}

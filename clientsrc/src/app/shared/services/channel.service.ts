import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ServiceBase } from './service-base';
import { PagingFilterCriteria } from '../base-model/paging-filter-criteria';
import { ChannelModel, AddChannelStoreAssignmentModel } from 'src/app/ims/channels/channel.model';
import { QueryString } from '../base-model/query-string';

@Injectable({ providedIn: 'root' })
export class ChannelService extends ServiceBase {
  getAll(page: number = 1, numberItemsPerPage: number = 10) {
    return this.page(`${environment.app.ims.apiUrl}/api/channels`, new PagingFilterCriteria(page, numberItemsPerPage));
  }

  getBy(id: string): Observable<ChannelModel> {
    return this.get(`${environment.app.ims.apiUrl}/api/channels/${id}`);
  }

  getStoresBy(id: string) {
    return this.get(`${environment.app.ims.apiUrl}/api/channels/${id}/stores`);
  }

  assignStoresToChannel(data: AddChannelStoreAssignmentModel[], id: string) {
    return this.post(`${environment.app.ims.apiUrl}/api/channels/${id}/stores`, data);
  }

  add(channel: ChannelModel): Observable<ChannelModel> {
    return this.post(`${environment.app.ims.apiUrl}/api/channels`, channel);
  }

  update(channel: ChannelModel): Observable<ChannelModel> {
    return this.put(`${environment.app.ims.apiUrl}/api/channels/${channel.id}`, channel);
  }

  remove(id: string) {
    return this.delete(`${environment.app.ims.apiUrl}/api/channels/${id}`);
  }

  updateProvision(channelId: string): Observable<any> {
    return this.post(`${environment.app.ims.apiUrl}/api/channels/${channelId}/provision`);
  }

  getCatalog(channelId: string, searchText = '', page: number = 1, numberItemsPerPage: number = 10): Observable<any> {
    const queryStrings = [];
    queryStrings.push(new QueryString('channelId', channelId));
    queryStrings.push(new QueryString('searchText', searchText));
    return this.pageWithQueryString(`${environment.app.ims.apiUrl}/api/channels/products`,
      queryStrings, new PagingFilterCriteria(page, numberItemsPerPage));
  }

  getRetailChannel(): Observable<any> {
    return this.get(`${environment.app.retail.apiUrl}/api/channel/`);
  }
}

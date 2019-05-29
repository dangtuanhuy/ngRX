import {
  HttpClient,
  HttpEvent,
  HttpRequest,
  HttpHeaders
} from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { NotificationService } from './notification.service';
import { PagedResult } from '../base-model/paged-result';
import { PagingFilterCriteria } from '../base-model/paging-filter-criteria';
import { QueryString } from '../base-model/query-string';
import { checkJsonString } from '../utils/JSON.util';


@Injectable()
export abstract class ServiceBase {
  constructor(
    private http: HttpClient,
    private notificationService: NotificationService
  ) { }
  protected post<T>(url: string, data?: T, option?: Object): Observable<T> {
    return this.http
      .post<T>(url, data, option)
      .pipe(catchError(err => this.handleError(err, this.notificationService)));
  }

  protected put<T>(url: string, data?: T): Observable<T> {
    return this.http
      .put<T>(url, data)
      .pipe(catchError(err => this.handleError(err, this.notificationService)));
  }

  protected delete(url: string) {
    return this.http
      .delete<boolean>(url)
      .pipe(catchError(err => this.handleError(err, this.notificationService)));
  }

  protected get<T>(url: string, headers?: HttpHeaders, option?: Object): Observable<T> {
    if (headers) {
      return this.http
        .get<T>(url, { headers: headers })
        .pipe(
          catchError(err => this.handleError(err, this.notificationService))
        );
    } else {
      if (option) {
        return this.http
          .get<T>(url, option)
          .pipe(
            catchError(err => this.handleError(err, this.notificationService))
          );
      } else {
        return this.http
          .get<T>(url)
          .pipe(
            catchError(err => this.handleError(err, this.notificationService))
          );
      }
    }
  }

  protected list<T>(url: string) {
    return this.http
      .get<T[]>(url)
      .pipe(catchError(err => this.handleError(err, this.notificationService)));
  }

  protected page<T>(url: string, pagingFilterCriteria: PagingFilterCriteria) {
    return this.http
      .get<PagedResult<T>>(
        `${url}?page=${pagingFilterCriteria.page}&numberItemsPerPage=${
        pagingFilterCriteria.numberItemsPerPage
        }`
      )
      .pipe(catchError(err => this.handleError(err, this.notificationService)));
  }

  protected pageWithQueryString<T>(url: string, queryStrings: QueryString[], pagingFilterCriteria: PagingFilterCriteria) {
    let requestUrl = `${url}?page=${pagingFilterCriteria.page}&numberItemsPerPage=${pagingFilterCriteria.numberItemsPerPage}`;
    queryStrings.forEach(item => {
      requestUrl = requestUrl + '&' + item.key + `=${item.value}`;
    });
    return this.http
      .get<PagedResult<T>>(requestUrl)
      .pipe(catchError(err => this.handleError(err, this.notificationService)));
  }

  protected pageWithSearchText<T>(
    url: string,
    pagingFilterCriteria: PagingFilterCriteria,
    queryText: string
  ) {
    return this.http
      .get<PagedResult<T>>(
        `${url}?page=${pagingFilterCriteria.page}&numberItemsPerPage=${
        pagingFilterCriteria.numberItemsPerPage
        }&queryText=${queryText}`
      )
      .pipe(catchError(err => this.handleError(err, this.notificationService)));
  }

  protected uploadFile(
    url: string,
    data?: any,
    option?: any
  ): Observable<HttpEvent<{}>> {
    const uploadReq = new HttpRequest('POST', url, data, option);
    return this.http
      .request(uploadReq)
      .pipe(catchError(err => this.handleError(err, this.notificationService)));
  }

  private handleError(err, notificationService: NotificationService) {
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      errorMessage = `An error occurred: ${err.error.message}`;
    } else if (err.error.detail) {
      errorMessage = err.error.detail;
    } else {
      if (checkJsonString(err.error)) {
        const error = JSON.parse(err.error);
        errorMessage = error.detail;
      } else {
        errorMessage = 'Something went wrong!';
      }
    }
    notificationService.error(errorMessage);
    return throwError(errorMessage);
  }
}

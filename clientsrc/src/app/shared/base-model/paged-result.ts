export class PagedResult<T> {
    totalItems: number;
    currentPage: number;
    numberItemsPerPage: number;
    data: T[];
}

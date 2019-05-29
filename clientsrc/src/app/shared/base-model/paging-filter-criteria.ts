export class PagingFilterCriteria {
    page: number;
    numberItemsPerPage: number;
    constructor(page: number, numberItemsPerPage: number) {
        this.page = page;
        this.numberItemsPerPage = numberItemsPerPage;
    }
}

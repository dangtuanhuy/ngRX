export class PagingExtension {
    public static pagingData(data: any[], pageIndex: number, pageSize: number) {
        return data.slice(pageSize * pageIndex, pageSize * (pageIndex + 1));
    }
}

export class StringExtension {
    public static ensureTheLengthEnoughWithNumber(data: string, length: number) {
        data = data ? data : '';
        while (data.length < length) {
            data = '0' + data;
        }

        return data;
    }
}

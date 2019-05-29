export class ArrayExtension {
    public static removeDuplicates(data: any[], field: string) {
        const uniqueData = [];

        data.forEach(item => {
            const existed = uniqueData.find(x => x[field] === item[field]);
            if (existed) {
                return;
            }

            uniqueData.push(item);
        });

        return uniqueData;
    }

    public static removePrimitiveTypeDuplicates(data: any[]) {
        const uniqueData = [];

        data.forEach(item => {
            const existed = uniqueData.find(x => x === item);
            if (existed) {
                return;
            }

            uniqueData.push(item);
        });

        return uniqueData;
    }
}

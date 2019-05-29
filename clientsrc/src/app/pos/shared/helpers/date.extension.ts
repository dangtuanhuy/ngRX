export class DateExtension {
    public static convertUTCDateToLocalDate(date) {
        const newDate = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);

        const offset = date.getTimezoneOffset() / 60;
        const hours = date.getHours();

        newDate.setHours(hours - offset);

        return newDate;
    }

    public static convertLocalDateToUTCDate(date) {
        return new Date(date.getTime() + date.getTimezoneOffset() * 60000);
    }

    public static dateToString(date: Date): string {
        let result = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
        result += ` ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

        return result;
    }

    public static stringToDate(dateString: string): Date {
        const data = dateString.split(' ');
        if (data.length < 2) {
            return new Date();
        }

        const dateYYMMDD = data[0].split('-');
        const dateTime = data[1].split(':');
        return new Date(Number(dateYYMMDD[0]), Number(dateYYMMDD[1]), Number(dateYYMMDD[2]),
            Number(dateTime[0]), Number(dateTime[1]), Number(dateTime[2]));
    }

    public static dateToUTCString(date: Date): string {
        let result = `${date.getUTCFullYear()}-${date.getUTCMonth() + 1}-${date.getUTCDate()}`;
        result += ` ${date.getUTCHours()}:${date.getUTCMinutes()}:${date.getUTCSeconds()}`;

        return result;
    }
}

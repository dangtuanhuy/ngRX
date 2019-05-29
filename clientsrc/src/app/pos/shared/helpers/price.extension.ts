export class PriceExtension {
    public static calculateNetPrices(totalPrice: number, discountPrices: number[], tax: number) {
        const totalGST = this.round(totalPrice * tax / 100, 2);
        let net = totalPrice;
        discountPrices.forEach(price => {
            net -= Math.abs(price);
        });

        net = net > 0 ? net : 0;
        net += totalGST;

        return net;
    }

    public static roundDown(number, decimals) {
        decimals = decimals || 0;
        if (decimals === 2) {
            const thounds = number * 1000;
            return (Math.floor(thounds / 10) / Math.pow(10, 2));
        } else {
            return (Math.floor(number * Math.pow(10, decimals)) / Math.pow(10, decimals));
        }
    }

    public static roundUp(num, precision) {
        precision = Math.pow(10, precision);
        return Math.ceil(num * precision) / precision;
    }

    public static round(number, decimals) {
        decimals = decimals || 0;
        return (Math.round(number * Math.pow(10, decimals)) / Math.pow(10, decimals));
    }
}

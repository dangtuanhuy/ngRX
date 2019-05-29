import { Denomination } from '../components/denominations-table/models/denomination.model';


export class DenominationViewModel extends Denomination {
    quantity: number;
}

export function calculateDenominationsTotal(denominations: DenominationViewModel[]) {
    let total = 0;
    if (Array.isArray(denominations)) {
        denominations.forEach(item => {
            const quantity = Number(item.quantity);
            const value = Number(item.value);
            total += (quantity ? quantity : 0) * (value ? value : 0);
        });
    }

    return total;
}

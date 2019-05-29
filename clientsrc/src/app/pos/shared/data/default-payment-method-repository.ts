import { RepositoryBase } from './repository-base';
import { Injectable } from '@angular/core';
import { AppContextManager } from '../app-context-manager';
import { SchemaNames } from '../constants/schema-name.constant';
import { DefaultPaymentMethod, DefaultPaymentMethodPageType } from '../models/default-payment-method';
import { Guid } from 'src/app/shared/utils/guid.util';

@Injectable({ providedIn: 'root' })
export class DefaultPaymentMethodRepository extends RepositoryBase<DefaultPaymentMethod> {
    Map(obj: any): DefaultPaymentMethod {
        const result: DefaultPaymentMethod = {
            id: obj.id,
            no: obj.no ? obj.no : 1,
            code: obj.code,
            pageType: obj.pageType ? obj.pageType : DefaultPaymentMethodPageType.default
        };
        return result;
    }
    constructor(protected appContextManager: AppContextManager) {
        super(appContextManager, SchemaNames.defaultPaymentMethod);
    }

    addDefaultPaymentMethod(no: number, code: string, pageType: DefaultPaymentMethodPageType): DefaultPaymentMethod {
        const context = this.appContextManager.GetLatestDbContext();
        const data = context.objects(this.tableName)
            .sorted('no', true)
            .filter(x => x.pageType === pageType);

        if (data.length) {
            const existedData = data.find(x => x.code === code);
            if (existedData) {
                const result = this.Map(existedData);
                context.close();
                return result;
            }
        }

        if (no === -1) {
            if (!data.length) {
                no = 1;
            } else {
                no = data[0].no;
                no++;
            }
        }
        context.close();

        const newDefaultPaymentMethod = new DefaultPaymentMethod();
        newDefaultPaymentMethod.id = Guid.newGuid();
        newDefaultPaymentMethod.no = no;
        newDefaultPaymentMethod.code = code;
        newDefaultPaymentMethod.pageType = pageType;

        return this.add(newDefaultPaymentMethod);
    }

    deleteDefaultPaymentMethod(code: string): boolean {
        if (code === 'CASH') {
            return false;
        }

        const context = this.appContextManager.GetLatestDbContext();
        const existingEntities = context.objects(this.tableName).filtered('code = $0', code);
        if (!existingEntities.length) {
            context.close();
            return false;
        }

        const entity = existingEntities[0];
        context.write(() => {
            context.delete(entity);
        });
        context.close();
        return true;
    }
}

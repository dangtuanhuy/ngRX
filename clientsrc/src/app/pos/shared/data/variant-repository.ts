import { RepositoryBase } from './repository-base';
import { Injectable } from '@angular/core';
import { AppContextManager } from '../app-context-manager';
import { Variant, VariantModel } from '../models/variant';
import { SchemaNames } from '../constants/schema-name.constant';
import {
  VariantByStockTypeAndVariantIdAndPriceRequest,
  VariantByStockTypeAndVariantIdAndPriceResponse
} from '../requests/realms/variant.request';
import { ArrayExtension } from '../helpers/array.extension';
import { VariantPagingModel } from '../view-models/variant-paging.model';
import { PagingExtension } from '../helpers/paging.extension';
import { AppSettingRepository } from './appSetting-repository';
import { SystemAppSettingKeys } from '../constants/appSetting-key.constant';

@Injectable({ providedIn: 'root' })
export class VariantRepository extends RepositoryBase<Variant> {
  Map(obj: any) {
    const result: Variant = {
      id: obj.id,
      variantId: obj.variantId,
      productId: obj.productId,
      priceId: obj.priceId,
      stockTypeId: obj.stockTypeId,
      stockType: obj.stockType,
      description: obj.description,
      listPrice: obj.listPrice,
      staffPrice: obj.staffPrice,
      memberPrice: obj.memberPrice,
      locationId: obj.locationId,
      quantity: Number(obj.quantity),
      skuCode: obj.skuCode,
      isDelete: obj.isDelete ? obj.isDelete : false
    };
    return result;
  }
  constructor(protected appContextManager: AppContextManager,
    private appSettingRepository: AppSettingRepository) {
    super(appContextManager, SchemaNames.variant);
  }

  getByProducts(productIds: string[], locationId: string) {
    const context = this.appContextManager.GetLatestDbContext();
    let result = [];
    const data = locationId
      ? context.objects(this.tableName).filtered('locationId = $0', locationId)
      : context.objects(this.tableName);

    const filteredData = data.filter(x => productIds.includes(x.productId));
    if (!filteredData.length) {
      context.close();
      return result;
    }
    filteredData.forEach(element => {
      result.push(this.Map(element));
    });
    result = ArrayExtension.removeDuplicates(result, 'variantId');
    context.close();
    return result;
  }

  getByProductIdsAndLocationIdPaging(productIds: string[], locationId: string, pageIndex: number, pageSize: number): VariantPagingModel {
    const context = this.appContextManager.GetLatestDbContext();
    const result = new VariantPagingModel();
    const data = locationId
      ? context.objects(this.tableName).filtered('locationId = $0 AND isDelete = false', locationId)
      : context.objects(this.tableName).filtered('isDelete = false');

    const filteredData = data.filter(x => productIds.includes(x.productId));

    result.pageNumber = pageIndex;
    result.pageSize = pageSize;
    result.totalItem = filteredData.length;
    result.variants = [];

    const variants = [];
    const pagedData = PagingExtension.pagingData(filteredData, pageIndex, pageSize);
    pagedData.forEach(element => {
      variants.push(this.Map(element));
    });

    result.variants = variants;

    context.close();
    return result;
  }

  getByProductPaging(productIds: string[], pageIndex: number, pageSize: number): VariantPagingModel {
    const context = this.appContextManager.GetLatestDbContext();
    const result = new VariantPagingModel();
    const data = context.objects(this.tableName)
      .filtered('isDelete = false')
      .filter(x => productIds.includes(x.productId));

    const stores = context.objects(SchemaNames.location);

    result.pageNumber = pageIndex;
    result.pageSize = pageSize;
    result.totalItem = data.length;
    result.variants = [];

    if (!data.length) {
      context.close();
      return result;
    }

    const pagedData = PagingExtension.pagingData(data, pageIndex, pageSize);
    pagedData.forEach(element => {
      const variantModel: VariantModel = new VariantModel();
      variantModel.id = element.id;
      variantModel.productId = element.productId;
      variantModel.priceId = element.priceId;
      variantModel.stockTypeId = element.stockTypeId;
      variantModel.stockType = element.stockType;
      variantModel.description = element.description;
      variantModel.listPrice = element.listPrice;
      variantModel.staffPrice = element.staffPrice;
      variantModel.memberPrice = element.memberPrice;
      variantModel.quantity = element.quantity;
      variantModel.skuCode = element.skuCode;
      variantModel.locationId = element.locationId;
      variantModel.isDelete = element.isDelete;

      const correspondingStore = stores.find(x => x.id === element.locationId);
      variantModel.locationName = correspondingStore ? correspondingStore.name : '';
      result.variants.push(variantModel);
    });

    context.close();
    return result;
  }

  search(textSearch: string, storeId: string) {
    const context = this.appContextManager.GetLatestDbContext();
    const result = {
      fromBarCode: false,
      data: []
    };

    if (textSearch) {
      const searchedProductsByBarCore = this.searchProducstByBarCodeFromContext(context, textSearch);
      if (searchedProductsByBarCore.length) {
        result.fromBarCode = true;
        result.data = this.mergeVariants(searchedProductsByBarCore, storeId);
        context.close();
        return result;
      }
    }

    const data = context
      .objects(this.tableName)
      .filtered('isDelete = false')
      .filter(x =>
        x.description.toUpperCase().includes(textSearch.toUpperCase())
        || x.skuCode.toUpperCase().includes(textSearch.toUpperCase())
      );
    if (!data.length) {
      context.close();
      return result;
    }
    const variants = [];
    data.forEach(element => {
      variants.push(this.Map(element));
    });

    result.data = this.mergeVariants(variants, storeId);
    context.close();
    return result;
  }

  getByVariantAndStockType(variantId: string, stockTypeId: string) {
    const context = this.appContextManager.GetLatestDbContext();
    const data = context.objects(this.tableName)
      .filtered('isDelete = false')
      .find(x => x.variantId === variantId && x.stockTypeId === stockTypeId);
    let result = null;
    if (data) {
      result = this.Map(data);
    }

    context.close();
    return result;
  }

  getByVariantId(variantId: string): Variant[] {
    const context = this.appContextManager.GetLatestDbContext();
    const data = context.objects(this.tableName)
      .filtered('isDelete = false && variantId = $0', variantId);

    const result = [];
    if (!data.length) {
      context.close();
      return result;
    }

    data.forEach(element => {
      result.push(this.Map(element));
    });

    context.close();
    return result;
  }

  getVariantsByStockTypeAndVariantAndPrice(request: VariantByStockTypeAndVariantIdAndPriceRequest)
    : VariantByStockTypeAndVariantIdAndPriceResponse {
    const context = this.appContextManager.GetLatestDbContext();

    const stockTypeAndVariantIdAndPriceRequest = request.stockTypeAndVariantIdAndPriceRequest;
    const result = new VariantByStockTypeAndVariantIdAndPriceResponse();
    stockTypeAndVariantIdAndPriceRequest.forEach(requestItem => {
      const variantRealms = context.objects(this.tableName)
        .filtered(`stockTypeId = $0 && variantId = $1 && priceId = $2`,
          requestItem.stockTypeId, requestItem.variantId, requestItem.priceId);

      if (variantRealms.length > 0) {
        const variant = this.Map(variantRealms[0]);
        result.variants.push(variant);
      } else {
        let error = `StockType ${requestItem.stockTypeId}`;
        error += `, Variant ${requestItem.variantId}`;
        error += `, Price ${requestItem.priceId} not found!`;
        result.errors.push(error);
      }
    });

    context.close();
    return result;
  }


  getVariantsByProductId(productId: string) {
    const context = this.appContextManager.GetLatestDbContext();
    let result = [];
    const data = context.objects(this.tableName).filtered('productId = $0', productId);

    if (!data.length) {
      context.close();
      return result;
    }
    data.forEach(element => {
      result.push(this.Map(element));
    });
    result = ArrayExtension.removeDuplicates(result, 'variantId');
    context.close();
    return result;
  }

  getByVariantIds(ids: string[]): Variant[] {
    const context = this.appContextManager.GetLatestDbContext();
    const data = context.objects(this.tableName).filter(x => ids.includes(x.variantId));

    const result = [];
    if (!data.length) {
      context.close();
      return result;
    }

    data.forEach(element => {
      result.push(this.Map(element));
    });

    context.close();
    return result;
  }

  private searchProducstByBarCodeFromContext(context: any, textSearch: string) {
    const barCodeRealms = context.objects(SchemaNames.barCode).filter(x => x.code.toUpperCase() === textSearch.toUpperCase());

    const variantId = [];
    const result = [];
    if (!barCodeRealms.length) {
      return result;
    }

    barCodeRealms.forEach(barCodeRealm => {
      variantId.push(barCodeRealm.variantId);
    });

    let variantRealms = context.objects(SchemaNames.variant)
      .filtered('isDelete = false')
      .filter(x => variantId.includes(x.variantId));
    if (!variantRealms.length) {
      return result;
    }

    variantRealms = ArrayExtension.removeDuplicates(variantRealms, 'variantId');

    variantRealms.forEach(element => {
      result.push(this.Map(element));
    });

    return result;
  }

  private mergeVariants(variants: any[], storeId) {
    const result = [];

    variants.filter(x => x.locationId === storeId).forEach(variant => {
      const selected = result.find(x => x.variantId === variant.variantId);

      if (selected) {
        selected.quantity += variant.quantity;
      } else {
        result.push(variant);
      }
    });

    return result;
  }
}

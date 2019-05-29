import { Injectable } from '@angular/core';
import { RepositoryBase } from './repository-base';
import { Product } from '../models/product';
import { AppContextManager } from '../app-context-manager';
import { VariantRepository } from './variant-repository';
import { SchemaNames } from '../constants/schema-name.constant';
import { Variant } from '../models/variant';
import { StockPricePagingModel, StockPriceViewModel } from '../view-models/stock-price-page-response.model';
import { PagingExtension } from '../helpers/paging.extension';
import { ProductPagingModel } from '../view-models/product-paging.model';
import { UnitOfWork } from './unit-of-work';

@Injectable({ providedIn: 'root' })
export class ProductRepository extends RepositoryBase<Product> {
    Map(obj: any) {
        const result: Product = {
            id: obj.id,
            name: obj.name,
            description: obj.description,
            categoryId: obj.categoryId,
            variants: obj.variants,
            isDelete: obj.isDelete ? obj.isDelete : false,
            createdDate: obj.createdDate,
            updatedDate: obj.updatedDate
        };
        return result;
    }
    constructor(
        private variantRepository: VariantRepository,
        protected appContextManager: AppContextManager) {
        super(appContextManager, 'Products');
    }

    getByCategories(categoryIds: string[]) {
        const context = this.appContextManager.GetLatestDbContext();
        const result = [];
        const data = context.objects(this.tableName).filter(x => categoryIds.includes(x.categoryId));
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

    getProductIdsByCategories(categoryIds: string[]): string[] {
        const context = this.appContextManager.GetLatestDbContext();
        let result = [];
        const data = context.objects(this.tableName).filter(x => categoryIds.includes(x.categoryId));
        if (!data.length) {
            context.close();
            return result;
        }
        result = data.map(x => x.id);

        context.close();
        return result;
    }

    getIncludeVariants(textSearch: string) {
        const context = this.appContextManager.GetLatestDbContext();
        const result = [];
        const realmProducts = context.objects(this.tableName).filter(x => x.name.toUpperCase().includes(textSearch.toUpperCase()));
        if (!realmProducts.length) {
            context.close();
            return result;
        }

        realmProducts.forEach(element => {
            const product = this.Map(element);
            const variantRealms = context.objects(SchemaNames.variant)
                .filtered(`productId = "${product.id}"`)
                .sorted('variantId');

            const variants = [];
            let currentVariant: Variant = null;
            variantRealms.forEach(variantRealm => {
                const variant = this.variantRepository.Map(variantRealm);
                if (!currentVariant) {
                    currentVariant = variant;
                    return;
                }

                if (variant.variantId === currentVariant.variantId) {
                    currentVariant.quantity += variant.quantity;
                    return;
                }

                variants.push(currentVariant);
                currentVariant = variant;
            });
            if (currentVariant) {
                variants.push(currentVariant);
            }

            product.variants = variants;

            result.push(product);
        });
        context.close();
        return result;
    }

    getIncludeVariantsPaging(textSearch: string, size = 10, pageIndex = 0) {
        const context = this.appContextManager.GetLatestDbContext();
        const result = [];
        const realmProducts = context.objects(this.tableName).filter(x => x.name.toUpperCase().includes(textSearch.toUpperCase()))
            .slice(size * pageIndex, size);
        if (!realmProducts.length) {
            context.close();
            return result;
        }

        realmProducts.forEach(element => {
            const product = this.Map(element);
            const variantRealms = context.objects(SchemaNames.variant)
                .filtered(`productId = "${product.id}"`)
                .sorted('variantId');

            const variants = [];
            let currentVariant: Variant = null;
            variantRealms.forEach(variantRealm => {
                const variant = this.variantRepository.Map(variantRealm);
                if (!currentVariant) {
                    currentVariant = variant;
                    return;
                }

                if (variant.variantId === currentVariant.variantId) {
                    currentVariant.quantity += variant.quantity;
                    return;
                }

                variants.push(currentVariant);
                currentVariant = variant;
            });
            if (currentVariant) {
                variants.push(currentVariant);
            }

            product.variants = variants;

            result.push(product);
        });
        context.close();
        return result;
    }

    getProductsPaging(pageIndex: number, pageSize: number): ProductPagingModel {
        const context = this.appContextManager.GetLatestDbContext();
        const data = context.objects(this.tableName).filtered(`isDelete = false`);
        const result = this.mapPagingData(data, pageIndex, pageSize);

        context.close();
        return result;
    }

    searchProductsPaging(pageIndex: number, pageSize: number, textSearch: string): ProductPagingModel {
        const context = this.appContextManager.GetLatestDbContext();

        if (textSearch) {
            const productByBarCode = this.searchProductsByBarCode(context, textSearch);
            if (productByBarCode) {
                const model = new ProductPagingModel();
                model.pageNumber = pageIndex;
                model.pageSize = 10;
                model.totalItem = 1;
                model.products = [productByBarCode];

                context.close();
                return model;
            }
            const productBySKUCode = this.searchProductsBySKUCode(context, textSearch);
            if (productBySKUCode) {
                const model = new ProductPagingModel();
                model.pageNumber = pageIndex;
                model.pageSize = 10;
                model.totalItem = 1;
                model.products = [productBySKUCode];

                context.close();
                return model;
            }
        }

        let data = context.objects(this.tableName).filtered(`isDelete = false`);
        if (textSearch) {
            data = data.filter(x => x.isDelete === false
                && (x.name.toUpperCase().includes(textSearch.toUpperCase())
                    || x.description.toUpperCase().includes(textSearch.toUpperCase())
                )
            );
        }

        const result = this.mapPagingData(data, pageIndex, pageSize);

        context.close();
        return result;
    }

    private mapPagingData(data: any[], pageIndex: number, pageSize: number): ProductPagingModel {
        const result = new ProductPagingModel();
        result.pageNumber = pageIndex;
        result.pageSize = pageSize;
        result.totalItem = data.length;
        result.products = [];

        if (!data.length) {
            return result;
        }

        const pagedData = PagingExtension.pagingData(data, pageIndex, pageSize);
        pagedData.forEach(element => {
            const product = new Product();
            product.id = element.id;
            product.name = element.name;
            product.description = element.description;
            product.categoryId = element.categoryId;
            product.isDelete = element.isDelete;

            result.products.push(product);
        });

        return result;
    }

    public addProductsToUnitOfWork(unitOfWork: UnitOfWork, products: any[]) {
        products.forEach(product => {
            const realmProduct = new Product();
            realmProduct.id = product.id;
            realmProduct.name = product.name;
            realmProduct.description = product.description;
            realmProduct.categoryId = product.categoryId;
            realmProduct.isDelete = product.isDelete;
            realmProduct.createdDate = product.createdDate;
            realmProduct.updatedDate = product.updatedDate;

            unitOfWork.add(SchemaNames.product, realmProduct);
        });
    }

    private searchProductsByBarCode(context: any, textSearch: string) {
        const textSearchUpper = textSearch.toUpperCase();
        const dataByBarCode = context.objects(SchemaNames.barCode)
            .filtered(`isDelete = false and code = $0`, textSearchUpper);

        if (dataByBarCode.length !== 1) {
            return null;
        }

        const variants = context.objects(SchemaNames.variant).filtered(`variantId = $0`, dataByBarCode[0].variantId);
        if (!variants.length) {
            return null;
        }
        const variant = variants[0];
        const products = context.objects(SchemaNames.product).filtered(`id = $0`, variant.productId);
        if (!products.length) {
            return null;
        }
        const realmProduct = products[0];

        const product = new Product();
        product.id = realmProduct.id;
        product.name = realmProduct.name;
        product.description = realmProduct.description;
        product.categoryId = realmProduct.categoryId;
        product.isDelete = realmProduct.isDelete;

        return product;
    }

    private searchProductsBySKUCode(context: any, textSearch: string) {
        const textSearchUpper = textSearch.toUpperCase();
        const dataBySKUCode = context.objects(SchemaNames.variant).filtered(`skuCode = $0`, textSearchUpper);

        if (dataBySKUCode.length !== 1) {
            return null;
        }

        const variant = dataBySKUCode[0];
        const products = context.objects(SchemaNames.product).filtered(`id = $0`, variant.productId);
        if (!products.length) {
            return null;
        }
        const realmProduct = products[0];

        const product = new Product();
        product.id = realmProduct.id;
        product.name = realmProduct.name;
        product.description = realmProduct.description;
        product.categoryId = realmProduct.categoryId;
        product.isDelete = realmProduct.isDelete;

        return product;
    }
}

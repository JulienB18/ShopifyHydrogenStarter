import type { HydrogenApiRouteOptions, HydrogenRequest } from '@shopify/hydrogen';
import { ProductConnection } from '@shopify/hydrogen/storefront-api-types';
import { TOP_PRODUCTS_QUERY } from './query';

export async function api(_request: HydrogenRequest, { queryShop }: HydrogenApiRouteOptions) {
    const {
        data: { products },
    } = await queryShop<{
        products: ProductConnection;
    }>({
        query: TOP_PRODUCTS_QUERY,
        variables: {
            count: 4,
        },
    });

    return products.nodes;
}

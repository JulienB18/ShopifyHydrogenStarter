import { Suspense } from 'react';
import {
    useShopQuery,
    useLocalization,
    type HydrogenRequest,
    type HydrogenApiRouteOptions,
    Seo,
} from '@shopify/hydrogen';

import type { Collection } from '@shopify/hydrogen/storefront-api-types';
import { PAGINATION_SIZE } from '../../lib/const';
import { ProductGrid, PageHeader, Section } from '../../components';
import { Layout } from '../../components/index.server';
import { ALL_PRODUCTS_QUERY, PAGINATE_ALL_PRODUCTS_QUERY } from './query';

function AllProductsGrid() {
    const {
        language: { isoCode: languageCode },
        country: { isoCode: countryCode },
    } = useLocalization();

    const { data } = useShopQuery<any>({
        query: ALL_PRODUCTS_QUERY,
        variables: {
            country: countryCode,
            language: languageCode,
            pageBy: PAGINATION_SIZE,
        },
        preload: true,
    });

    const { products } = data;

    return (
        <ProductGrid key="products" url={`/products?country=${countryCode}`} collection={{ products } as Collection} />
    );
}

export default function AllProducts() {
    return (
        <Layout>
            <Seo type="page" data={{ title: 'All Products' }} />
            <PageHeader heading="All Products" variant="allCollections" />
            <Section>
                <Suspense>
                    <AllProductsGrid />
                </Suspense>
            </Section>
        </Layout>
    );
}

// API to paginate products
// @see templates/demo-store/src/components/product/ProductGrid.client.tsx
export async function api(request: HydrogenRequest, { params, queryShop }: HydrogenApiRouteOptions) {
    if (request.method !== 'POST') {
        return new Response('Method not allowed', {
            status: 405,
            headers: { Allow: 'POST' },
        });
    }

    const url = new URL(request.url);
    const cursor = url.searchParams.get('cursor');
    const country = url.searchParams.get('country');
    const { handle } = params;

    return queryShop({
        query: PAGINATE_ALL_PRODUCTS_QUERY,
        variables: {
            handle,
            cursor,
            pageBy: PAGINATION_SIZE,
            country,
        },
    });
}

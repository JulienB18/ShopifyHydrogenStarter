import { Suspense, useMemo } from 'react';
import { useShopQuery, useLocalization } from '@shopify/hydrogen';
import type { Product, ProductConnection } from '@shopify/hydrogen/storefront-api-types';
import { ProductCard, Section } from '..';
import { RECOMMENDED_PRODUCTS_QUERY, TOP_PRODUCTS_QUERY } from './query';

const mockProducts = new Array(12).fill('');

function ProductCards({ products }: { products: Product[] }) {
    return (
        <>
            {products.map((product) => (
                <ProductCard product={product} key={product.id} className={'snap-start w-80'} />
            ))}
        </>
    );
}

function RecommendedProducts({ productId, count }: { productId: string; count: number }) {
    const {
        language: { isoCode: languageCode },
        country: { isoCode: countryCode },
    } = useLocalization();

    const { data: products } = useShopQuery<{
        recommended: Product[];
        additional: ProductConnection;
    }>({
        query: RECOMMENDED_PRODUCTS_QUERY,
        variables: {
            count,
            productId,
            languageCode,
            countryCode,
        },
    });

    const mergedProducts = products.recommended
        .concat(products.additional.nodes)
        .filter((value, index, array) => array.findIndex((value2) => value2.id === value.id) === index);

    const originalProduct = mergedProducts.map((item) => item.id).indexOf(productId);

    mergedProducts.splice(originalProduct, 1);

    return <ProductCards products={mergedProducts} />;
}

function TopProducts({ count }: { count: number }) {
    const {
        data: { products },
    } = useShopQuery({
        query: TOP_PRODUCTS_QUERY,
        variables: {
            count,
        },
    }) as any;

    return <ProductCards products={products.nodes} />;
}

export function ProductSwimlane({ title = 'Featured Products', data = mockProducts, count = 12, ...props }) {
    const productCardsMarkup = useMemo(() => {
        // If the data is already provided, there's no need to query it, so we'll just return the data
        if (typeof data === 'object') {
            return <ProductCards products={data} />;
        }

        // If the data provided is a productId, we will query the productRecommendations API.
        // To make sure we have enough products for the swimlane, we'll combine the results with our top selling products.
        if (typeof data === 'string') {
            return (
                <Suspense>
                    <RecommendedProducts productId={data} count={count} />
                </Suspense>
            );
        }

        // If no data is provided, we'll go and query the top products
        return <TopProducts count={count} />;
    }, [count, data]);

    return (
        <Section heading={title} padding="y" {...props}>
            <div className="swimlane hiddenScroll md:pb-8 md:scroll-px-8 lg:scroll-px-12 md:px-8 lg:px-12">
                {productCardsMarkup}
            </div>
        </Section>
    );
}

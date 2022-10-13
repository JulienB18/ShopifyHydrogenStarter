import { useShopQuery } from '@shopify/hydrogen';

import { FeaturedCollections } from '..';
import { ProductSwimlane } from '../index.server';
import { PAGINATION_SIZE } from '../../lib/const';
import { SEARCH_NO_RESULTS_QUERY } from './query';

export function NoResultRecommendations({ country, language }: { country: string; language: string }) {
    const { data } = useShopQuery<any>({
        query: SEARCH_NO_RESULTS_QUERY,
        variables: {
            country,
            language,
            pageBy: PAGINATION_SIZE,
        },
        preload: false,
    });

    return (
        <>
            <FeaturedCollections title="Trending Collections" data={data.featuredCollections.nodes} />
            <ProductSwimlane title="Trending Products" data={data.featuredProducts.nodes} />
        </>
    );
}

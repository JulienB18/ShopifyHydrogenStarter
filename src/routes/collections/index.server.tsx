import { Suspense } from 'react';
import { Seo, useLocalization, useShopQuery } from '@shopify/hydrogen';

import { Collection } from '@shopify/hydrogen/storefront-api-types';
import { Grid, PageHeader, Section } from '../../components';
import { CollectionCard, Layout } from '../../components/index.server';
import { PAGINATION_SIZE, getImageLoadingPriority } from '../../lib/const';
import { COLLECTIONS_QUERY } from './query';

function CollectionGrid() {
    const {
        language: { isoCode: languageCode },
        country: { isoCode: countryCode },
    } = useLocalization();

    const { data } = useShopQuery<any>({
        query: COLLECTIONS_QUERY,
        variables: {
            pageBy: PAGINATION_SIZE,
            country: countryCode,
            language: languageCode,
        },
        preload: true,
    });

    const collections: Collection[] = data.collections.nodes;

    return (
        <Grid items={collections.length === 3 ? 3 : 2}>
            {collections.map((collection, i) => (
                <CollectionCard collection={collection} key={collection.id} loading={getImageLoadingPriority(i, 2)} />
            ))}
        </Grid>
    );
}

export default function Collections() {
    return (
        <Layout>
            <Seo type="page" data={{ title: 'All Collections' }} />
            <PageHeader heading="Collections" />
            <Section>
                <Suspense>
                    <CollectionGrid />
                </Suspense>
            </Section>
        </Layout>
    );
}

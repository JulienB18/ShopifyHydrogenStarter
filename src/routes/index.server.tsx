import { Suspense } from 'react';
import {
    CacheLong,
    Seo,
    ShopifyAnalyticsConstants,
    useServerAnalytics,
    useLocalization,
    useShopQuery,
} from '@shopify/hydrogen';

import { CollectionConnection, ProductConnection } from '@shopify/hydrogen/storefront-api-types';
import { getHeroPlaceholder } from '../lib/placeholders';
import { FeaturedCollections, Hero } from '../components';
import { Layout, ProductSwimlane } from '../components/index.server';
import { HOMEPAGE_CONTENT_QUERY, HOMEPAGE_SEO_QUERY } from './query';

function HomepageContent() {
    const {
        language: { isoCode: languageCode },
        country: { isoCode: countryCode },
    } = useLocalization();

    const { data } = useShopQuery<{
        heroBanners: CollectionConnection;
        featuredCollections: CollectionConnection;
        featuredProducts: ProductConnection;
    }>({
        query: HOMEPAGE_CONTENT_QUERY,
        variables: {
            language: languageCode,
            country: countryCode,
        },
        preload: true,
    });

    const { heroBanners, featuredCollections, featuredProducts } = data;

    // fill in the hero banners with placeholders if they're missing
    const [primaryHero, secondaryHero, tertiaryHero] = getHeroPlaceholder(heroBanners.nodes);

    return (
        <>
            {primaryHero && <Hero {...primaryHero} height="full" top loading="eager" />}
            <ProductSwimlane data={featuredProducts.nodes} title="Featured Products" divider="bottom" />
            {secondaryHero && <Hero {...secondaryHero} />}
            <FeaturedCollections data={featuredCollections.nodes} title="Collections" />
            {tertiaryHero && <Hero {...tertiaryHero} />}
        </>
    );
}

function SeoForHomepage() {
    const {
        data: {
            shop: { name, description },
        },
    } = useShopQuery({
        query: HOMEPAGE_SEO_QUERY,
        cache: CacheLong(),
        preload: true,
    }) as any;

    return (
        <Seo
            type="homepage"
            data={{
                title: name,
                description,
                titleTemplate: '%s · Powered by Hydrogen',
            }}
        />
    );
}

export default function Homepage() {
    useServerAnalytics({
        shopify: {
            pageType: ShopifyAnalyticsConstants.pageType.home,
        },
    });

    return (
        <Layout>
            <Suspense>
                <SeoForHomepage />
            </Suspense>
            <Suspense>
                <HomepageContent />
            </Suspense>
        </Layout>
    );
}

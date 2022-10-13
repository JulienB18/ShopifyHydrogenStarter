import { Suspense } from 'react';
import {
    ProductOptionsProvider,
    Seo,
    ShopifyAnalyticsConstants,
    useLocalization,
    useRouteParams,
    useServerAnalytics,
    useShopQuery,
} from '@shopify/hydrogen';

import { getExcerpt } from '../../lib/utils';
import { NotFound, Layout, ProductSwimlane } from '../../components/index.server';
import { Heading, ProductDetail, ProductForm, ProductGallery, Section, Text } from '../../components';
import { PRODUCT_QUERY } from './query';

export default function Product() {
    const { handle } = useRouteParams();
    const {
        language: { isoCode: languageCode },
        country: { isoCode: countryCode },
    } = useLocalization();

    const {
        data: { product, shop },
    } = useShopQuery({
        query: PRODUCT_QUERY,
        variables: {
            country: countryCode,
            language: languageCode,
            handle,
        },
        preload: true,
    }) as any;

    if (!product) {
        return <NotFound type="product" />;
    }

    useServerAnalytics({
        shopify: {
            pageType: ShopifyAnalyticsConstants.pageType.product,
            resourceId: product.id,
        },
    });

    const { media, title, vendor, descriptionHtml, id } = product;
    const { shippingPolicy, refundPolicy } = shop;

    return (
        <Layout>
            <Suspense>
                <Seo type="product" data={product} />
            </Suspense>
            <ProductOptionsProvider data={product}>
                <Section padding="x" className="px-0">
                    <div className="grid items-start md:gap-6 lg:gap-20 md:grid-cols-2 lg:grid-cols-3">
                        <ProductGallery media={media.nodes} className="w-screen md:w-full lg:col-span-2" />
                        <div className="sticky md:-mb-nav md:top-nav md:-translate-y-nav md:h-screen md:pt-nav hiddenScroll md:overflow-y-scroll">
                            <section className="flex flex-col w-full max-w-xl gap-8 p-6 md:mx-auto md:max-w-sm md:px-0">
                                <div className="grid gap-2">
                                    <Heading as="h1" format className="whitespace-normal">
                                        {title}
                                    </Heading>
                                    {vendor && <Text className={'opacity-50 font-medium'}>{vendor}</Text>}
                                </div>
                                <ProductForm />
                                <div className="grid gap-4 py-4">
                                    {descriptionHtml && (
                                        <ProductDetail title="Product Details" content={descriptionHtml} />
                                    )}
                                    {shippingPolicy?.body && (
                                        <ProductDetail
                                            title="Shipping"
                                            content={getExcerpt(shippingPolicy.body) ?? ''}
                                            learnMore={`/policies/${shippingPolicy.handle}`}
                                        />
                                    )}
                                    {refundPolicy?.body && (
                                        <ProductDetail
                                            title="Returns"
                                            content={getExcerpt(refundPolicy.body) ?? ''}
                                            learnMore={`/policies/${refundPolicy.handle}`}
                                        />
                                    )}
                                </div>
                            </section>
                        </div>
                    </div>
                </Section>
                <Suspense>
                    <ProductSwimlane title="Related Products" data={id} />
                </Suspense>
            </ProductOptionsProvider>
        </Layout>
    );
}

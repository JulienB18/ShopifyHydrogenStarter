import {
    useLocalization,
    useShopQuery,
    Seo,
    useServerAnalytics,
    ShopifyAnalyticsConstants,
    type HydrogenRouteProps,
} from '@shopify/hydrogen';
import { Suspense } from 'react';

import { PageHeader } from '../../components';
import { NotFound, Layout } from '../../components/index.server';
import { PAGE_QUERY } from './query';

export default function Page({ params }: HydrogenRouteProps) {
    const {
        language: { isoCode: languageCode },
    } = useLocalization();

    const { handle } = params;
    const {
        data: { page },
    } = useShopQuery({
        query: PAGE_QUERY,
        variables: { languageCode, handle },
    }) as any;

    if (!page) {
        return <NotFound />;
    }

    useServerAnalytics({
        shopify: {
            pageType: ShopifyAnalyticsConstants.pageType.page,
            resourceId: page.id,
        },
    });

    return (
        <Layout>
            <Suspense>
                <Seo type="page" data={page} />
            </Suspense>
            <PageHeader heading={page.title}>
                <div dangerouslySetInnerHTML={{ __html: page.body }} className="prose dark:prose-invert" />
            </PageHeader>
        </Layout>
    );
}

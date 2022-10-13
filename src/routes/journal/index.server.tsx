import {
    CacheLong,
    flattenConnection,
    type HydrogenRouteProps,
    Seo,
    useLocalization,
    useShopQuery,
} from '@shopify/hydrogen';
import type { Article, Blog as BlogType } from '@shopify/hydrogen/storefront-api-types';
import { Suspense } from 'react';

import { ArticleCard, Grid, PageHeader } from '../../components';
import { Layout } from '../../components/index.server';
import { getImageLoadingPriority, PAGINATION_SIZE } from '../../lib/const';
import { BLOG_QUERY } from './query';

const BLOG_HANDLE = 'Journal';

function JournalsGrid({ pageBy }: { pageBy: number }) {
    const {
        language: { isoCode: languageCode },
        country: { isoCode: countryCode },
    } = useLocalization();

    const { data } = useShopQuery<{
        blog: BlogType;
    }>({
        query: BLOG_QUERY,
        variables: {
            language: languageCode,
            blogHandle: BLOG_HANDLE,
            pageBy,
        },
    });

    // TODO: How to fix this type?
    const rawArticles = flattenConnection<Article>(data.blog.articles);

    const articles = rawArticles.map((article) => {
        const { publishedAt } = article;
        return {
            ...article,
            publishedAt: new Intl.DateTimeFormat(`${languageCode}-${countryCode}`, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            }).format(new Date(publishedAt!)),
        };
    });

    if (articles.length === 0) {
        return <p>No articles found</p>;
    }

    return (
        <Grid as="ol" layout="blog" gap="blog">
            {articles.map((article, i) => {
                return (
                    <ArticleCard
                        blogHandle={BLOG_HANDLE.toLowerCase()}
                        article={article as Article}
                        key={article.id}
                        loading={getImageLoadingPriority(i, 2)}
                    />
                );
            })}
        </Grid>
    );
}

export default function Blog({ pageBy = PAGINATION_SIZE, response }: HydrogenRouteProps) {
    response.cache(CacheLong());

    return (
        <Layout>
            <Seo type="page" data={{ title: 'All Journals' }} />
            <PageHeader heading={BLOG_HANDLE} className="gap-0">
                <Suspense>
                    <JournalsGrid pageBy={pageBy} />
                </Suspense>
            </PageHeader>
        </Layout>
    );
}

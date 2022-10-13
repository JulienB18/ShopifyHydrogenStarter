import { gql } from '@shopify/hydrogen';
import { MEDIA_FRAGMENT, PRODUCT_CARD_FRAGMENT } from '../lib/fragments';

/* Admin server */
export const SHOP_QUERY = gql`
    query {
        shop {
            primaryDomain {
                url
            }
        }
    }
`;

/* Index server */

/**
 * The homepage content query includes a request for custom metafields inside the alias
 * `heroBanners`. The template loads placeholder content if these metafields don't
 * exist. Define the following five custom metafields on your Shopify store to override placeholders:
 * - hero.title             Single line text
 * - hero.byline            Single line text
 * - hero.cta               Single line text
 * - hero.spread            File
 * - hero.spread_secondary  File
 *
 * @see https://help.shopify.com/manual/metafields/metafield-definitions/creating-custom-metafield-definitions
 * @see https://github.com/Shopify/hydrogen/discussions/1790
 */

export const HOMEPAGE_CONTENT_QUERY = gql`
    ${MEDIA_FRAGMENT}
    ${PRODUCT_CARD_FRAGMENT}
    query homepage($country: CountryCode, $language: LanguageCode) @inContext(country: $country, language: $language) {
        heroBanners: collections(first: 3, query: "collection_type:custom", sortKey: UPDATED_AT) {
            nodes {
                id
                handle
                title
                descriptionHtml
                heading: metafield(namespace: "hero", key: "title") {
                    value
                }
                byline: metafield(namespace: "hero", key: "byline") {
                    value
                }
                cta: metafield(namespace: "hero", key: "cta") {
                    value
                }
                spread: metafield(namespace: "hero", key: "spread") {
                    reference {
                        ...Media
                    }
                }
                spreadSecondary: metafield(namespace: "hero", key: "spread_secondary") {
                    reference {
                        ...Media
                    }
                }
            }
        }
        featuredCollections: collections(first: 3, query: "collection_type:smart", sortKey: UPDATED_AT) {
            nodes {
                id
                title
                handle
                image {
                    altText
                    width
                    height
                    url
                }
            }
        }
        featuredProducts: products(first: 12) {
            nodes {
                ...ProductCard
            }
        }
    }
`;

export const HOMEPAGE_SEO_QUERY = gql`
    query shopInfo {
        shop {
            name
            description
        }
    }
`;

/* Search server */

export const SEARCH_QUERY = gql`
    ${PRODUCT_CARD_FRAGMENT}
    query search($searchTerm: String, $country: CountryCode, $language: LanguageCode, $pageBy: Int!, $after: String)
    @inContext(country: $country, language: $language) {
        products(first: $pageBy, sortKey: RELEVANCE, query: $searchTerm, after: $after) {
            nodes {
                ...ProductCard
            }
            pageInfo {
                startCursor
                endCursor
                hasNextPage
                hasPreviousPage
            }
        }
    }
`;

export const PAGINATE_SEARCH_QUERY = gql`
    ${PRODUCT_CARD_FRAGMENT}
    query ProductsPage(
        $searchTerm: String
        $pageBy: Int!
        $cursor: String
        $country: CountryCode
        $language: LanguageCode
    ) @inContext(country: $country, language: $language) {
        products(sortKey: RELEVANCE, query: $searchTerm, first: $pageBy, after: $cursor) {
            nodes {
                ...ProductCard
            }
            pageInfo {
                hasNextPage
                endCursor
            }
        }
    }
`;

/* Sitemap xml server */

export const QUERY = gql`
    query sitemaps($urlLimits: Int, $language: LanguageCode) @inContext(language: $language) {
        products(first: $urlLimits, query: "published_status:'online_store:visible'") {
            edges {
                node {
                    updatedAt
                    handle
                    onlineStoreUrl
                    title
                    featuredImage {
                        url
                        altText
                    }
                }
            }
        }
        collections(first: $urlLimits, query: "published_status:'online_store:visible'") {
            edges {
                node {
                    updatedAt
                    handle
                    onlineStoreUrl
                }
            }
        }
        pages(first: $urlLimits, query: "published_status:'published'") {
            edges {
                node {
                    updatedAt
                    handle
                    onlineStoreUrl
                }
            }
        }
    }
`;

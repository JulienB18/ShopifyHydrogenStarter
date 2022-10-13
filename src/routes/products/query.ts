import { gql } from '@shopify/hydrogen';
import { PRODUCT_CARD_FRAGMENT, MEDIA_FRAGMENT } from '../../lib/fragments';

export const ALL_PRODUCTS_QUERY = gql`
    ${PRODUCT_CARD_FRAGMENT}
    query AllProducts($country: CountryCode, $language: LanguageCode, $pageBy: Int!, $cursor: String)
    @inContext(country: $country, language: $language) {
        products(first: $pageBy, after: $cursor) {
            nodes {
                ...ProductCard
            }
            pageInfo {
                hasNextPage
                startCursor
                endCursor
            }
        }
    }
`;

export const PAGINATE_ALL_PRODUCTS_QUERY = gql`
    ${PRODUCT_CARD_FRAGMENT}
    query ProductsPage($pageBy: Int!, $cursor: String, $country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
        products(first: $pageBy, after: $cursor) {
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

export const PRODUCT_QUERY = gql`
    ${MEDIA_FRAGMENT}
    query Product($country: CountryCode, $language: LanguageCode, $handle: String!)
    @inContext(country: $country, language: $language) {
        product(handle: $handle) {
            id
            title
            vendor
            descriptionHtml
            media(first: 7) {
                nodes {
                    ...Media
                }
            }
            variants(first: 100) {
                nodes {
                    id
                    availableForSale
                    selectedOptions {
                        name
                        value
                    }
                    image {
                        id
                        url
                        altText
                        width
                        height
                    }
                    priceV2 {
                        amount
                        currencyCode
                    }
                    compareAtPriceV2 {
                        amount
                        currencyCode
                    }
                    sku
                    title
                    unitPrice {
                        amount
                        currencyCode
                    }
                }
            }
            seo {
                description
                title
            }
        }
        shop {
            shippingPolicy {
                body
                handle
            }
            refundPolicy {
                body
                handle
            }
        }
    }
`;

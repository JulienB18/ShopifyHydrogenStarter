import { gql } from '@shopify/hydrogen';
import { PRODUCT_CARD_FRAGMENT } from '../../lib/fragments';

export const COLLECTIONS_QUERY = gql`
    query Collections($country: CountryCode, $language: LanguageCode, $pageBy: Int!)
    @inContext(country: $country, language: $language) {
        collections(first: $pageBy) {
            nodes {
                id
                title
                description
                handle
                seo {
                    description
                    title
                }
                image {
                    id
                    url
                    width
                    height
                    altText
                }
            }
        }
    }
`;

export const COLLECTION_QUERY = gql`
    ${PRODUCT_CARD_FRAGMENT}
    query CollectionDetails(
        $handle: String!
        $country: CountryCode
        $language: LanguageCode
        $pageBy: Int!
        $cursor: String
    ) @inContext(country: $country, language: $language) {
        collection(handle: $handle) {
            id
            title
            description
            seo {
                description
                title
            }
            image {
                id
                url
                width
                height
                altText
            }
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
    }
`;

export const PAGINATE_COLLECTION_QUERY = gql`
    ${PRODUCT_CARD_FRAGMENT}
    query CollectionPage(
        $handle: String!
        $pageBy: Int!
        $cursor: String
        $country: CountryCode
        $language: LanguageCode
    ) @inContext(country: $country, language: $language) {
        collection(handle: $handle) {
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
    }
`;

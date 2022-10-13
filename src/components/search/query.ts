import { gql } from '@shopify/hydrogen';
import { PRODUCT_CARD_FRAGMENT } from '../../lib/fragments';

export const SEARCH_NO_RESULTS_QUERY = gql`
    ${PRODUCT_CARD_FRAGMENT}
    query searchNoResult($country: CountryCode, $language: LanguageCode, $pageBy: Int!)
    @inContext(country: $country, language: $language) {
        featuredCollections: collections(first: 3, sortKey: UPDATED_AT) {
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
        featuredProducts: products(first: $pageBy) {
            nodes {
                ...ProductCard
            }
        }
    }
`;

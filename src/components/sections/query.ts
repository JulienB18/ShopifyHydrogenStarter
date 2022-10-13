import { gql } from '@shopify/hydrogen';
import { PRODUCT_CARD_FRAGMENT } from '../../lib/fragments';

export const RECOMMENDED_PRODUCTS_QUERY = gql`
    ${PRODUCT_CARD_FRAGMENT}
    query productRecommendations($productId: ID!, $count: Int, $countryCode: CountryCode, $languageCode: LanguageCode)
    @inContext(country: $countryCode, language: $languageCode) {
        recommended: productRecommendations(productId: $productId) {
            ...ProductCard
        }
        additional: products(first: $count, sortKey: BEST_SELLING) {
            nodes {
                ...ProductCard
            }
        }
    }
`;

export const TOP_PRODUCTS_QUERY = gql`
    ${PRODUCT_CARD_FRAGMENT}
    query topProducts($count: Int, $countryCode: CountryCode, $languageCode: LanguageCode)
    @inContext(country: $countryCode, language: $languageCode) {
        products(first: $count, sortKey: BEST_SELLING) {
            nodes {
                ...ProductCard
            }
        }
    }
`;

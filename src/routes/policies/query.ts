import { gql } from '@shopify/hydrogen';

export const POLICIES_QUERY = gql`
    fragment Policy on ShopPolicy {
        id
        title
        handle
    }

    query PoliciesQuery {
        shop {
            privacyPolicy {
                ...Policy
            }
            shippingPolicy {
                ...Policy
            }
            termsOfService {
                ...Policy
            }
            refundPolicy {
                ...Policy
            }
            subscriptionPolicy {
                id
                title
                handle
            }
        }
    }
`;

export const POLICIES_QUERY_HANDLE = gql`
    fragment Policy on ShopPolicy {
        body
        handle
        id
        title
        url
    }

    query PoliciesQuery(
        $languageCode: LanguageCode
        $privacyPolicy: Boolean!
        $shippingPolicy: Boolean!
        $termsOfService: Boolean!
        $refundPolicy: Boolean!
    ) @inContext(language: $languageCode) {
        shop {
            privacyPolicy @include(if: $privacyPolicy) {
                ...Policy
            }
            shippingPolicy @include(if: $shippingPolicy) {
                ...Policy
            }
            termsOfService @include(if: $termsOfService) {
                ...Policy
            }
            refundPolicy @include(if: $refundPolicy) {
                ...Policy
            }
        }
    }
`;

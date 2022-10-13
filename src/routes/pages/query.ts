import { gql } from '@shopify/hydrogen';

export const PAGE_QUERY = gql`
    query PageDetails($languageCode: LanguageCode, $handle: String!) @inContext(language: $languageCode) {
        page(handle: $handle) {
            id
            title
            body
            seo {
                description
                title
            }
        }
    }
`;

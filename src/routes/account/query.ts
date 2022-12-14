import { gql } from '@shopify/hydrogen';
import { PRODUCT_CARD_FRAGMENT } from '../../lib/fragments';

export const CUSTOMER_CREATE_MUTATION = gql`
    mutation customerCreate($input: CustomerCreateInput!) {
        customerCreate(input: $input) {
            customer {
                id
            }
            customerUserErrors {
                code
                field
                message
            }
        }
    }
`;

export const CUSTOMER_RECOVER_MUTATION = gql`
    mutation customerRecover($email: String!) {
        customerRecover(email: $email) {
            customerUserErrors {
                code
                field
                message
            }
        }
    }
`;

export const LOGIN_MUTATION = gql`
    mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
        customerAccessTokenCreate(input: $input) {
            customerUserErrors {
                code
                field
                message
            }
            customerAccessToken {
                accessToken
                expiresAt
            }
        }
    }
`;

export const SHOP_QUERY = gql`
    query shopInfo {
        shop {
            name
        }
    }
`;

export const CUSTOMER_QUERY = gql`
    ${PRODUCT_CARD_FRAGMENT}
    query CustomerDetails($customerAccessToken: String!, $country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
        customer(customerAccessToken: $customerAccessToken) {
            firstName
            lastName
            phone
            email
            defaultAddress {
                id
                formatted
            }
            addresses(first: 6) {
                edges {
                    node {
                        id
                        formatted
                        firstName
                        lastName
                        company
                        address1
                        address2
                        country
                        province
                        city
                        zip
                        phone
                    }
                }
            }
            orders(first: 250, sortKey: PROCESSED_AT, reverse: true) {
                edges {
                    node {
                        id
                        orderNumber
                        processedAt
                        financialStatus
                        fulfillmentStatus
                        currentTotalPrice {
                            amount
                            currencyCode
                        }
                        lineItems(first: 2) {
                            edges {
                                node {
                                    variant {
                                        image {
                                            url
                                            altText
                                            height
                                            width
                                        }
                                    }
                                    title
                                }
                            }
                        }
                    }
                }
            }
        }
        featuredProducts: products(first: 12) {
            nodes {
                ...ProductCard
            }
        }
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
    }
`;

export const CUSTOMER_UPDATE_MUTATION = gql`
    mutation customerUpdate($customer: CustomerUpdateInput!, $customerAccessToken: String!) {
        customerUpdate(customer: $customer, customerAccessToken: $customerAccessToken) {
            customerUserErrors {
                code
                field
                message
            }
        }
    }
`;

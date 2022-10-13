import { gql } from '@shopify/hydrogen';

// @see: https://shopify.dev/api/storefront/2022-07/objects/Order#fields
export const ORDER_QUERY = gql`
    fragment Money on MoneyV2 {
        amount
        currencyCode
    }

    fragment AddressFull on MailingAddress {
        address1
        address2
        city
        company
        country
        countryCodeV2
        firstName
        formatted
        id
        lastName
        name
        phone
        province
        provinceCode
        zip
    }

    fragment DiscountApplication on DiscountApplication {
        value {
            ... on MoneyV2 {
                amount
                currencyCode
            }
            ... on PricingPercentageValue {
                percentage
            }
        }
    }

    fragment Image on Image {
        altText
        height
        src: url(transform: { crop: CENTER, maxHeight: 96, maxWidth: 96, scale: 2 })
        id
        width
    }

    fragment ProductVariant on ProductVariant {
        image {
            ...Image
        }
        priceV2 {
            ...Money
        }
        product {
            handle
        }
        sku
        title
    }

    fragment LineItemFull on OrderLineItem {
        title
        quantity
        discountAllocations {
            allocatedAmount {
                ...Money
            }
            discountApplication {
                ...DiscountApplication
            }
        }
        originalTotalPrice {
            ...Money
        }
        discountedTotalPrice {
            ...Money
        }
        variant {
            ...ProductVariant
        }
    }

    query orderById($customerAccessToken: String!, $orderId: String!, $country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
        customer(customerAccessToken: $customerAccessToken) {
            orders(first: 1, query: $orderId) {
                nodes {
                    id
                    name
                    orderNumber
                    processedAt
                    fulfillmentStatus
                    totalTaxV2 {
                        ...Money
                    }
                    totalPriceV2 {
                        ...Money
                    }
                    subtotalPriceV2 {
                        ...Money
                    }
                    shippingAddress {
                        ...AddressFull
                    }
                    discountApplications(first: 100) {
                        nodes {
                            ...DiscountApplication
                        }
                    }
                    lineItems(first: 100) {
                        nodes {
                            ...LineItemFull
                        }
                    }
                }
            }
        }
    }
`;

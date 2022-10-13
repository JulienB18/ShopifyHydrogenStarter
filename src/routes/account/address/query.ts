import { gql } from '@shopify/hydrogen';

export const CREATE_ADDRESS_MUTATION = gql`
    mutation customerAddressCreate($address: MailingAddressInput!, $customerAccessToken: String!) {
        customerAddressCreate(address: $address, customerAccessToken: $customerAccessToken) {
            customerAddress {
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

export const UPDATE_ADDRESS_MUTATION = gql`
    mutation customerAddressUpdate($address: MailingAddressInput!, $customerAccessToken: String!, $id: ID!) {
        customerAddressUpdate(address: $address, customerAccessToken: $customerAccessToken, id: $id) {
            customerUserErrors {
                code
                field
                message
            }
        }
    }
`;

export const UPDATE_DEFAULT_ADDRESS_MUTATION = gql`
    mutation customerDefaultAddressUpdate($addressId: ID!, $customerAccessToken: String!) {
        customerDefaultAddressUpdate(addressId: $addressId, customerAccessToken: $customerAccessToken) {
            customerUserErrors {
                code
                field
                message
            }
        }
    }
`;

export const DELETE_ADDRESS_MUTATION = gql`
    mutation customerAddressDelete($customerAccessToken: String!, $id: ID!) {
        customerAddressDelete(customerAccessToken: $customerAccessToken, id: $id) {
            customerUserErrors {
                code
                field
                message
            }
            deletedCustomerAddressId
        }
    }
`;

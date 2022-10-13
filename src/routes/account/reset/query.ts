import { gql } from '@shopify/hydrogen';

export const CUSTOMER_RESET_MUTATION = gql`
    mutation customerReset($id: ID!, $input: CustomerResetInput!) {
        customerReset(id: $id, input: $input) {
            customerAccessToken {
                accessToken
                expiresAt
            }
            customerUserErrors {
                code
                field
                message
            }
        }
    }
`;

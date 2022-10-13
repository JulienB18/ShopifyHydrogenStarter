import { gql } from '@shopify/hydrogen';

export const CUSTOMER_ACTIVATE_MUTATION = gql`
    mutation customerActivate($id: ID!, $input: CustomerActivateInput!) {
        customerActivate(id: $id, input: $input) {
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

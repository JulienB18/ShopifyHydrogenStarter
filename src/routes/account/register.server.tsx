import { Suspense } from 'react';
import {
    CacheNone,
    Seo,
    type HydrogenRequest,
    type HydrogenApiRouteOptions,
    type HydrogenRouteProps,
} from '@shopify/hydrogen';

import { AccountCreateForm } from '../../components';
import { Layout } from '../../components/index.server';
import { getApiErrorMessage } from '../../lib/utils';
import { CUSTOMER_CREATE_MUTATION } from './query';

export default function Register({ response }: HydrogenRouteProps) {
    response.cache(CacheNone());

    return (
        <Layout>
            <Suspense>
                <Seo type="noindex" data={{ title: 'Register' }} />
            </Suspense>
            <AccountCreateForm />
        </Layout>
    );
}

export async function api(request: HydrogenRequest, { queryShop }: HydrogenApiRouteOptions) {
    const jsonBody = await request.json();

    if (!jsonBody.email || !jsonBody.password) {
        return new Response(JSON.stringify({ error: 'Email and password are required' }), { status: 400 });
    }

    const { data, errors } = await queryShop<{ customerCreate: any }>({
        query: CUSTOMER_CREATE_MUTATION,
        variables: {
            input: {
                email: jsonBody.email,
                password: jsonBody.password,
                firstName: jsonBody.firstName,
                lastName: jsonBody.lastName,
            },
        },
        // @ts-expect-error `queryShop.cache` is not yet supported but soon will be.
        cache: CacheNone(),
    });

    const errorMessage = getApiErrorMessage('customerCreate', data, errors);

    if (
        !errorMessage &&
        data &&
        data.customerCreate &&
        data.customerCreate.customer &&
        data.customerCreate.customer.id
    ) {
        return new Response(null, {
            status: 200,
        });
    }
    return new Response(
        JSON.stringify({
            error: errorMessage ?? 'Unknown error',
        }),
        { status: 401 },
    );
}

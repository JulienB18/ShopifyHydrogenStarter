import { Suspense } from 'react';
import {
    useShopQuery,
    CacheLong,
    CacheNone,
    Seo,
    type HydrogenRouteProps,
    HydrogenRequest,
    HydrogenApiRouteOptions,
} from '@shopify/hydrogen';

import { AccountLoginForm } from '../../components';
import { Layout } from '../../components/index.server';
import { LOGIN_MUTATION, SHOP_QUERY } from './query';

export default function Login({ response }: HydrogenRouteProps) {
    response.cache(CacheNone());

    const {
        data: {
            shop: { name },
        },
    } = useShopQuery({
        query: SHOP_QUERY,
        cache: CacheLong(),
        preload: '*',
    }) as any;

    return (
        <Layout>
            <Suspense>
                <Seo type="noindex" data={{ title: 'Login' }} />
            </Suspense>
            <AccountLoginForm shopName={name} />
        </Layout>
    );
}

export async function api(request: HydrogenRequest, { session, queryShop }: HydrogenApiRouteOptions) {
    if (!session) {
        return new Response('Session storage not available.', { status: 400 });
    }

    const jsonBody = await request.json();

    if (!jsonBody.email || !jsonBody.password) {
        return new Response(JSON.stringify({ error: 'Incorrect email or password.' }), { status: 400 });
    }

    const { data, errors } = await queryShop<{ customerAccessTokenCreate: any }>({
        query: LOGIN_MUTATION,
        variables: {
            input: {
                email: jsonBody.email,
                password: jsonBody.password,
            },
        },
        // @ts-expect-error `queryShop.cache` is not yet supported but soon will be.
        cache: CacheNone(),
    });

    if (data?.customerAccessTokenCreate?.customerAccessToken?.accessToken) {
        await session.set('customerAccessToken', data.customerAccessTokenCreate.customerAccessToken.accessToken);

        return new Response(null, {
            status: 200,
        });
    }
    return new Response(
        JSON.stringify({
            error: data?.customerAccessTokenCreate?.customerUserErrors ?? errors,
        }),
        { status: 401 },
    );
}

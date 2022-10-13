import { Suspense } from 'react';
import {
    CacheNone,
    Seo,
    type HydrogenRequest,
    type HydrogenApiRouteOptions,
    type HydrogenRouteProps,
} from '@shopify/hydrogen';

import { AccountRecoverForm } from '../../components';
import { Layout } from '../../components/index.server';
import { CUSTOMER_RECOVER_MUTATION } from './query';

/**
 * A form for the user to fill out to _initiate_ a password reset.
 * If the form succeeds, an email will be sent to the user with a link
 * to reset their password. Clicking the link leads the user to the
 * page `/account/reset/[resetToken]`.
 */
export default function AccountRecover({ response }: HydrogenRouteProps) {
    response.cache(CacheNone());

    return (
        <Layout>
            <Suspense>
                <Seo type="noindex" data={{ title: 'Recover password' }} />
            </Suspense>
            <AccountRecoverForm />
        </Layout>
    );
}

export async function api(request: HydrogenRequest, { queryShop }: HydrogenApiRouteOptions) {
    const jsonBody = await request.json();

    if (!jsonBody.email) {
        return new Response(JSON.stringify({ error: 'Email required' }), {
            status: 400,
        });
    }

    await queryShop({
        query: CUSTOMER_RECOVER_MUTATION,
        variables: {
            email: jsonBody.email,
        },
        // @ts-expect-error `queryShop.cache` is not yet supported but soon will be.
        cache: CacheNone(),
    });

    // Ignore errors, we don't want to tell the user if the email was
    // valid or not, thereby allowing them to determine who uses the site
    return new Response(null, {
        status: 200,
    });
}

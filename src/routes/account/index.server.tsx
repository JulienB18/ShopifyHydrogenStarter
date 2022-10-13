import { Suspense } from 'react';
import {
    CacheNone,
    flattenConnection,
    Seo,
    useSession,
    useLocalization,
    useShopQuery,
    type HydrogenRouteProps,
    type HydrogenRequest,
    type HydrogenApiRouteOptions,
} from '@shopify/hydrogen';

import type {
    Collection,
    CollectionConnection,
    Customer,
    MailingAddress,
    Order,
    Product,
    ProductConnection,
} from '@shopify/hydrogen/storefront-api-types';
import { getApiErrorMessage } from '../../lib/utils';
import {
    AccountAddressBook,
    AccountDetails,
    AccountOrderHistory,
    FeaturedCollections,
    LogoutButton,
    PageHeader,
} from '../../components';
import { Layout, ProductSwimlane } from '../../components/index.server';
import { CUSTOMER_QUERY, CUSTOMER_UPDATE_MUTATION } from './query';

function AuthenticatedAccount({
    customer,
    addresses,
    defaultAddress,
    featuredCollections,
    featuredProducts,
}: {
    customer: Customer;
    addresses: any[];
    defaultAddress?: string;
    featuredCollections: Collection[];
    featuredProducts: Product[];
}) {
    const orders = flattenConnection(customer?.orders) || [];

    let heading = 'Account Details';
    if (customer) {
        heading = customer.firstName ? `Welcome, ${customer.firstName}.` : 'Welcome to your account.';
    }

    return (
        <Layout>
            <Suspense>
                <Seo type="noindex" data={{ title: 'Account details' }} />
            </Suspense>
            <PageHeader heading={heading}>
                <LogoutButton>Sign out</LogoutButton>
            </PageHeader>
            {orders && <AccountOrderHistory orders={orders as Order[]} />}
            <AccountDetails
                firstName={customer.firstName as string}
                lastName={customer.lastName as string}
                phone={customer.phone as string}
                email={customer.email as string}
            />
            <AccountAddressBook defaultAddress={defaultAddress} addresses={addresses} />
            {!orders && (
                <>
                    <FeaturedCollections title="Popular Collections" data={featuredCollections} />
                    <ProductSwimlane data={featuredProducts} />
                </>
            )}
        </Layout>
    );
}

export default function Account({ response }: HydrogenRouteProps) {
    response.cache(CacheNone());

    const {
        language: { isoCode: languageCode },
        country: { isoCode: countryCode },
    } = useLocalization();
    const { customerAccessToken } = useSession();

    if (!customerAccessToken) return response.redirect('/account/login');

    const { data } = useShopQuery<{
        customer: Customer;
        featuredCollections: CollectionConnection;
        featuredProducts: ProductConnection;
    }>({
        query: CUSTOMER_QUERY,
        variables: {
            customerAccessToken,
            language: languageCode,
            country: countryCode,
        },
        cache: CacheNone(),
    });

    const { customer, featuredCollections, featuredProducts } = data;

    if (!customer) return response.redirect('/account/login');

    const addresses = flattenConnection<MailingAddress>(customer.addresses).map((address) => ({
        ...address,
        id: address.id!.substring(0, address.id!.lastIndexOf('?')),
        originalId: address.id,
    }));

    const defaultAddress = customer?.defaultAddress?.id?.substring(0, customer.defaultAddress.id.lastIndexOf('?'));

    return (
        <>
            <AuthenticatedAccount
                customer={customer}
                addresses={addresses}
                defaultAddress={defaultAddress}
                featuredCollections={flattenConnection<Collection>(featuredCollections) as Collection[]}
                featuredProducts={flattenConnection<Product>(featuredProducts) as Product[]}
            />
        </>
    );
}

export async function api(request: HydrogenRequest, { session, queryShop }: HydrogenApiRouteOptions) {
    if (request.method !== 'PATCH' && request.method !== 'DELETE') {
        return new Response(null, {
            status: 405,
            headers: {
                Allow: 'PATCH,DELETE',
            },
        });
    }

    if (!session) {
        return new Response('Session storage not available.', {
            status: 400,
        });
    }

    const { customerAccessToken } = await session.get();

    if (!customerAccessToken) return new Response(null, { status: 401 });

    const { email, phone, firstName, lastName, newPassword } = await request.json();

    interface CustomerCustom {
        email?: string;
        phone?: string;
        firstName?: string;
        lastName?: string;
        password?: string;
    }

    const customer: CustomerCustom = {};

    if (email) customer.email = email;
    if (phone) customer.phone = phone;
    if (firstName) customer.firstName = firstName;
    if (lastName) customer.lastName = lastName;
    if (newPassword) customer.password = newPassword;

    const { data, errors } = await queryShop<{ customerUpdate: any }>({
        query: CUSTOMER_UPDATE_MUTATION,
        variables: {
            customer,
            customerAccessToken,
        },
        cache: CacheNone(),
    } as any);

    const error = getApiErrorMessage('customerUpdate', data, errors);

    if (error) return new Response(JSON.stringify({ error }), { status: 400 });

    return new Response(null);
}

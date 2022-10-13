import { useEffect, useCallback, useState } from 'react';

import {
    useProductOptions,
    isBrowser,
    useUrl,
    AddToCartButton,
    Money,
    OptionWithValues,
    ShopPayButton,
} from '@shopify/hydrogen';

import { Heading, Text, Button, ProductOptions } from '..';

export function ProductForm() {
    const { pathname, search } = useUrl();
    const [params, setParams] = useState(new URLSearchParams(search));

    const { options, setSelectedOption, selectedOptions, selectedVariant } = useProductOptions();

    const isOutOfStock = !selectedVariant?.availableForSale || false;
    let isOnSale = false;
    if (
        selectedVariant &&
        selectedVariant?.priceV2 &&
        selectedVariant?.compareAtPriceV2 &&
        selectedVariant?.priceV2?.amount &&
        selectedVariant?.compareAtPriceV2?.amount &&
        selectedVariant?.priceV2?.amount < selectedVariant?.compareAtPriceV2?.amount
    ) {
        isOnSale = true;
    }

    useEffect(() => {
        if (params || !search) return;
        setParams(new URLSearchParams(search));
    }, [params, search]);

    useEffect(() => {
        (options as OptionWithValues[]).map(({ name, values }) => {
            if (!params) return false;
            const currentValue = params.get(name.toLowerCase()) || null;
            if (currentValue) {
                const matchedValue = values.filter((value) => encodeURIComponent(value.toLowerCase()) === currentValue);
                setSelectedOption(name, matchedValue[0] ?? '');
            }
            params.set(
                encodeURIComponent(name.toLowerCase()),
                encodeURIComponent(selectedOptions![name]!.toLowerCase()),
            );
            window.history.replaceState(null, '', `${pathname}?${params.toString()}`);
            return true;
        });
    }, []);

    const handleChange = useCallback(
        (name: string, value: string) => {
            setSelectedOption(name, value);
            if (!params) return;
            params.set(encodeURIComponent(name.toLowerCase()), encodeURIComponent(value.toLowerCase()));
            if (isBrowser()) {
                window.history.replaceState(null, '', `${pathname}?${params.toString()}`);
            }
        },
        [setSelectedOption, params, pathname],
    );

    return (
        <form className="grid gap-10">
            {
                <div className="grid gap-4">
                    {(options as OptionWithValues[]).map(({ name, values }) => {
                        if (values.length === 1) {
                            return null;
                        }
                        return (
                            <div key={name} className="flex flex-col flex-wrap mb-4 gap-y-2 last:mb-0">
                                <Heading as="legend" size="lead" className="min-w-[4rem]">
                                    {name}
                                </Heading>
                                <div className="flex flex-wrap items-baseline gap-4">
                                    <ProductOptions name={name} handleChange={handleChange} values={values} />
                                </div>
                            </div>
                        );
                    })}
                </div>
            }
            <div className="grid items-stretch gap-4">
                <AddToCartButton
                    variantId={selectedVariant?.id}
                    quantity={1}
                    accessibleAddingToCartLabel="Adding item to your cart"
                    disabled={isOutOfStock}
                    type="button"
                >
                    <Button width="full" variant={isOutOfStock ? 'secondary' : 'primary'} as="span">
                        {isOutOfStock ? (
                            <Text>Sold out</Text>
                        ) : (
                            <Text as="span" className="flex items-center justify-center gap-2">
                                <span>Add to bag</span> <span>·</span>{' '}
                                <Money withoutTrailingZeros data={selectedVariant.priceV2!} as="span" />
                                {isOnSale && (
                                    <Money
                                        withoutTrailingZeros
                                        data={selectedVariant.compareAtPriceV2!}
                                        as="span"
                                        className="opacity-50 strike"
                                    />
                                )}
                            </Text>
                        )}
                    </Button>
                </AddToCartButton>
                {!isOutOfStock && <ShopPayButton variantIds={[selectedVariant.id!]} />}
            </div>
        </form>
    );
}

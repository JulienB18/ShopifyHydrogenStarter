import { useRenderServerComponents } from '../../lib/utils';
import { Text, Button } from '../elements';

export async function callDeleteAddressApi(id: string) {
    try {
        const res = await fetch(`/account/address/${encodeURIComponent(id)}`, {
            method: 'DELETE',
            headers: {
                Accept: 'application/json',
            },
        });
        if (res.ok) {
            return {};
        }
        return await res.json();
    } catch (_e) {
        return {
            error: 'Error removing address. Please try again.',
        };
    }
}

export function AccountDeleteAddress({ addressId, close }: { addressId: string; close: () => void }) {
    // Necessary for edits to show up on the main page
    const renderServerComponents = useRenderServerComponents();

    async function deleteAddress(id: string) {
        const response = await callDeleteAddressApi(id);
        if (response.error) {
            return;
        }
        renderServerComponents();
        close();
    }

    return (
        <>
            <Text className="mb-4" as="h3" size="lead">
                Confirm removal
            </Text>
            <Text as="p">Are you sure you wish to remove this address?</Text>
            <div className="mt-6">
                <Button
                    className="text-sm"
                    onClick={() => {
                        deleteAddress(addressId);
                    }}
                    variant="primary"
                    width="full"
                >
                    Confirm
                </Button>
                <Button className="text-sm mt-2" onClick={close} variant="secondary" width="full">
                    Cancel
                </Button>
            </div>
        </>
    );
}

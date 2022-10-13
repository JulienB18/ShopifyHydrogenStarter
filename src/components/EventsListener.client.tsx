import { ClientAnalytics } from '@shopify/hydrogen';
import { useEffect } from 'react';

let init = false;

// Example client-side event listener
export function EventsListener() {
    useEffect(() => {
        if (init) return;
        init = true;

        // cart events
        ClientAnalytics.subscribe(ClientAnalytics.eventNames.ADD_TO_CART, () => {
            // emit ADD_TO_CART event to server
        });
        ClientAnalytics.subscribe(ClientAnalytics.eventNames.REMOVE_FROM_CART, () => {
            // emit REMOVE_FROM_CART event to server
        });
        ClientAnalytics.subscribe(ClientAnalytics.eventNames.UPDATE_CART, () => {
            // emit UPDATE_CART event to server
        });

        // other events...
    }, []);

    return null;
}

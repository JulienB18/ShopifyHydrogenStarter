import { Link } from '@shopify/hydrogen';
import { EnhancedMenu } from '../../lib/utils';
import { Text } from '..';
import { Drawer } from './Drawer.client';

function MenuMobileNav({ menu, onClose }: { menu: EnhancedMenu; onClose: () => void }) {
    return (
        <nav className="grid gap-4 p-6 sm:gap-6 sm:px-12 sm:py-8">
            {/* Top level menu items */}
            {(menu?.items || []).map((item) => (
                <Link key={item.id} to={item.to} target={item.target} onClick={onClose}>
                    <Text as="span" size="copy">
                        {item.title}
                    </Text>
                </Link>
            ))}
        </nav>
    );
}

export function MenuDrawer({ isOpen, onClose, menu }: { isOpen: boolean; onClose: () => void; menu: EnhancedMenu }) {
    return (
        <Drawer open={isOpen} onClose={onClose} openFrom="left" heading="Menu">
            <div className="grid">
                <MenuMobileNav menu={menu} onClose={onClose} />
            </div>
        </Drawer>
    );
}

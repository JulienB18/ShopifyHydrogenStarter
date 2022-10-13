import { flattenConnection, type HydrogenApiRouteOptions, type HydrogenRequest } from '@shopify/hydrogen';
import type {
    Collection,
    CollectionConnection,
    Page,
    PageConnection,
    Product,
    ProductConnection,
} from '@shopify/hydrogen/storefront-api-types';
import { QUERY } from './query';

const MAX_URLS = 250; // the google limit is 50K, however, SF API only allow querying for 250 resources each time

interface SitemapQueryData {
    products: ProductConnection;
    collections: CollectionConnection;
    pages: PageConnection;
}

function renderUrlTag({
    url,
    lastMod,
    changeFreq,
    image,
}: {
    url: string;
    lastMod?: string;
    changeFreq?: string;
    image?: {
        url: string;
        title?: string;
        caption?: string;
    };
}) {
    return `
    <url>
      <loc>${url}</loc>
      <lastmod>${lastMod}</lastmod>
      <changefreq>${changeFreq}</changefreq>
      ${
          image
              ? `
        <image:image>
          <image:loc>${image.url}</image:loc>
          <image:title>${image.title ?? ''}</image:title>
          <image:caption>${image.caption ?? ''}</image:caption>
        </image:image>`
              : ''
      }

    </url>
  `;
}

function shopSitemap(data: SitemapQueryData, baseUrl: string) {
    const productsList = flattenConnection(data.products) as Product[];
    const productsData = productsList
        .filter((product: any) => product.onlineStoreUrl)
        .map((product) => {
            const url = `${baseUrl}/products/${product.handle}`;

            const finalObject: ProductEntry = {
                url,
                lastMod: product.updatedAt!,
                changeFreq: 'daily',
            };

            if (product.featuredImage?.url) {
                finalObject.image = {
                    url: product.featuredImage!.url,
                };

                if (product.title) {
                    finalObject.image.title = product.title;
                }

                if (product.featuredImage!.altText) {
                    finalObject.image.caption = product.featuredImage!.altText;
                }
            }

            return finalObject;
        });

    const collectionsList = flattenConnection(data.collections) as Collection[];
    const collectionsData = collectionsList
        .filter((collection) => collection.onlineStoreUrl)
        .map((collection) => {
            const url = `${baseUrl}/collections/${collection.handle}`;

            return {
                url,
                lastMod: collection.updatedAt,
                changeFreq: 'daily',
            };
        });

    const pagesList = flattenConnection(data.pages) as Page[];
    const pagesData = pagesList
        .filter((page) => page.onlineStoreUrl)
        .map((page) => {
            const url = `${baseUrl}/pages/${page.handle}`;

            return {
                url,
                lastMod: page.updatedAt,
                changeFreq: 'weekly',
            };
        });

    const urlsDatas = [...productsData, ...collectionsData, ...pagesData];

    return `
    <urlset
      xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
      xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
    >
      ${urlsDatas.map((url) => renderUrlTag(url!)).join('')}
    </urlset>`;
}

export async function api(request: HydrogenRequest, { queryShop }: HydrogenApiRouteOptions) {
    const { data } = await queryShop<SitemapQueryData>({
        query: QUERY,
        variables: {
            language: 'EN',
            urlLimits: MAX_URLS,
        },
    });

    return new Response(shopSitemap(data, new URL(request.url).origin), {
        headers: {
            'content-type': 'application/xml',
            // Cache for 24 hours
            'cache-control': `max-age=${60 * 60 * 24}`,
        },
    });
}

interface ProductEntry {
    url: string;
    lastMod: string;
    changeFreq: string;
    image?: {
        url: string;
        title?: string;
        caption?: string;
    };
}

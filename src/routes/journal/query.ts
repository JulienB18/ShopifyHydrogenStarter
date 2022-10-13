import { gql } from '@shopify/hydrogen';

export const ARTICLE_QUERY = gql`
    query ArticleDetails($language: LanguageCode, $blogHandle: String!, $articleHandle: String!)
    @inContext(language: $language) {
        blog(handle: $blogHandle) {
            articleByHandle(handle: $articleHandle) {
                title
                contentHtml
                publishedAt
                author: authorV2 {
                    name
                }
                image {
                    id
                    altText
                    url
                    width
                    height
                }
            }
        }
    }
`;

export const BLOG_QUERY = gql`
    query Blog($language: LanguageCode, $blogHandle: String!, $pageBy: Int!, $cursor: String)
    @inContext(language: $language) {
        blog(handle: $blogHandle) {
            articles(first: $pageBy, after: $cursor) {
                edges {
                    node {
                        author: authorV2 {
                            name
                        }
                        contentHtml
                        handle
                        id
                        image {
                            id
                            altText
                            url
                            width
                            height
                        }
                        publishedAt
                        title
                    }
                }
            }
        }
    }
`;

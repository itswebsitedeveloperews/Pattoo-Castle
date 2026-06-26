import { createClient } from 'contentful'

export const contentfulConfig = {
  space:
    process.env.CONTENTFUL_SPACE_ID ||
    process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID ||
    process.env.VITE_CONTENTFUL_SPACE_ID,
  accessToken:
    process.env.CONTENTFUL_ACCESS_TOKEN ||
    process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN ||
    process.env.VITE_CONTENTFUL_ACCESS_TOKEN,
  environment:
    process.env.CONTENTFUL_ENVIRONMENT ||
    process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT ||
    process.env.VITE_CONTENTFUL_ENVIRONMENT ||
    'master',
  contentType:
    process.env.CONTENTFUL_CONTENT_TYPE ||
    process.env.NEXT_PUBLIC_CONTENTFUL_CONTENT_TYPE ||
    process.env.VITE_CONTENTFUL_CONTENT_TYPE,
  homePageContentType:
    process.env.CONTENTFUL_HOME_PAGE_CONTENT_TYPE ||
    process.env.NEXT_PUBLIC_CONTENTFUL_HOME_PAGE_CONTENT_TYPE ||
    process.env.VITE_CONTENTFUL_HOME_PAGE_CONTENT_TYPE ||
    'homePage',
}

export const isContentfulConfigured =
  Boolean(contentfulConfig.space) && Boolean(contentfulConfig.accessToken)

export const contentfulClient = isContentfulConfigured
  ? createClient({
      space: contentfulConfig.space,
      accessToken: contentfulConfig.accessToken,
      environment: contentfulConfig.environment,
    })
  : null

export async function getDefaultEntries() {
  if (!contentfulClient) {
    return []
  }

  const query = {
    limit: 6,
    order: '-sys.updatedAt',
  }

  if (contentfulConfig.contentType) {
    query.content_type = contentfulConfig.contentType
  }

  const response = await contentfulClient.getEntries(query)
  return response.items
}

export async function getHomePageEntry() {
  if (!contentfulClient) {
    return null
  }

  const response = await contentfulClient.getEntries({
    content_type: contentfulConfig.homePageContentType,
    include: 2,
    limit: 1,
    order: '-sys.updatedAt',
  })

  return response.items[0] || null
}

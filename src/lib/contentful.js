import { createClient } from 'contentful'

export const contentfulConfig = {
  space: import.meta.env.VITE_CONTENTFUL_SPACE_ID,
  accessToken: import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN,
  environment: import.meta.env.VITE_CONTENTFUL_ENVIRONMENT || 'master',
  contentType: import.meta.env.VITE_CONTENTFUL_CONTENT_TYPE,
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

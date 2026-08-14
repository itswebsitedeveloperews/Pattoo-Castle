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
  footerContentType:
    process.env.CONTENTFUL_FOOTER_CONTENT_TYPE ||
    process.env.NEXT_PUBLIC_CONTENTFUL_FOOTER_CONTENT_TYPE ||
    process.env.VITE_CONTENTFUL_FOOTER_CONTENT_TYPE ||
    'footer',
  headerContentType:
    process.env.CONTENTFUL_HEADER_CONTENT_TYPE ||
    process.env.NEXT_PUBLIC_CONTENTFUL_HEADER_CONTENT_TYPE ||
    process.env.VITE_CONTENTFUL_HEADER_CONTENT_TYPE ||
    'header',
  aboutContentType:
    process.env.CONTENTFUL_ABOUT_CONTENT_TYPE ||
    process.env.NEXT_PUBLIC_CONTENTFUL_ABOUT_CONTENT_TYPE ||
    process.env.VITE_CONTENTFUL_ABOUT_CONTENT_TYPE ||
    'about',
  overviewContentType:
    process.env.CONTENTFUL_OVERVIEW_CONTENT_TYPE ||
    process.env.NEXT_PUBLIC_CONTENTFUL_OVERVIEW_CONTENT_TYPE ||
    process.env.VITE_CONTENTFUL_OVERVIEW_CONTENT_TYPE ||
    'overview',
  overviewLocationContentType:
    process.env.CONTENTFUL_OVERVIEW_LOCATION_CONTENT_TYPE ||
    process.env.NEXT_PUBLIC_CONTENTFUL_OVERVIEW_LOCATION_CONTENT_TYPE ||
    process.env.VITE_CONTENTFUL_OVERVIEW_LOCATION_CONTENT_TYPE ||
    'pattooCastleLocation',
  gettingHereContentType:
    process.env.CONTENTFUL_GETTING_HERE_CONTENT_TYPE ||
    process.env.NEXT_PUBLIC_CONTENTFUL_GETTING_HERE_CONTENT_TYPE ||
    process.env.VITE_CONTENTFUL_GETTING_HERE_CONTENT_TYPE ||
    'gettingHere',
  accommodationContentType:
    process.env.CONTENTFUL_ACCOMMODATION_CONTENT_TYPE ||
    process.env.NEXT_PUBLIC_CONTENTFUL_ACCOMMODATION_CONTENT_TYPE ||
    process.env.VITE_CONTENTFUL_ACCOMMODATION_CONTENT_TYPE ||
    'accommodation',
  villaInclusionContentType:
    process.env.CONTENTFUL_VILLA_INCLUSION_CONTENT_TYPE ||
    process.env.NEXT_PUBLIC_CONTENTFUL_VILLA_INCLUSION_CONTENT_TYPE ||
    process.env.VITE_CONTENTFUL_VILLA_INCLUSION_CONTENT_TYPE ||
    'villaInclusions',
  villaDetailsContentType:
    process.env.CONTENTFUL_VILLA_DETAILS_CONTENT_TYPE ||
    process.env.NEXT_PUBLIC_CONTENTFUL_VILLA_DETAILS_CONTENT_TYPE ||
    process.env.VITE_CONTENTFUL_VILLA_DETAILS_CONTENT_TYPE ||
    'villaDetails',
  outdoorsContentType:
    process.env.CONTENTFUL_OUTDOORS_CONTENT_TYPE ||
    process.env.NEXT_PUBLIC_CONTENTFUL_OUTDOORS_CONTENT_TYPE ||
    process.env.VITE_CONTENTFUL_OUTDOORS_CONTENT_TYPE ||
    'outdoors',
  staffContentType:
    process.env.CONTENTFUL_STAFF_CONTENT_TYPE ||
    process.env.NEXT_PUBLIC_CONTENTFUL_STAFF_CONTENT_TYPE ||
    process.env.VITE_CONTENTFUL_STAFF_CONTENT_TYPE ||
    'staff',
  foodBeverageContentType:
    process.env.CONTENTFUL_FOOD_BEVERAGE_CONTENT_TYPE ||
    process.env.NEXT_PUBLIC_CONTENTFUL_FOOD_BEVERAGE_CONTENT_TYPE ||
    process.env.VITE_CONTENTFUL_FOOD_BEVERAGE_CONTENT_TYPE ||
    'foodBeverage',
  optionalToursActivitiesContentType:
    process.env.CONTENTFUL_OPTIONAL_TOURS_ACTIVITIES_CONTENT_TYPE ||
    process.env.NEXT_PUBLIC_CONTENTFUL_OPTIONAL_TOURS_ACTIVITIES_CONTENT_TYPE ||
    process.env.VITE_CONTENTFUL_OPTIONAL_TOURS_ACTIVITIES_CONTENT_TYPE ||
    'optionalToursActivities',
  galleryContentType:
    process.env.CONTENTFUL_GALLERY_CONTENT_TYPE ||
    process.env.NEXT_PUBLIC_CONTENTFUL_GALLERY_CONTENT_TYPE ||
    process.env.VITE_CONTENTFUL_GALLERY_CONTENT_TYPE ||
    'gallery',
  locationContentType:
    process.env.CONTENTFUL_LOCATION_CONTENT_TYPE ||
    process.env.NEXT_PUBLIC_CONTENTFUL_LOCATION_CONTENT_TYPE ||
    process.env.VITE_CONTENTFUL_LOCATION_CONTENT_TYPE ||
    'location',
  eventContentType:
    process.env.CONTENTFUL_EVENT_CONTENT_TYPE ||
    process.env.NEXT_PUBLIC_CONTENTFUL_EVENT_CONTENT_TYPE ||
    process.env.VITE_CONTENTFUL_EVENT_CONTENT_TYPE ||
    'event',
  eventDetailsContentType:
    process.env.CONTENTFUL_EVENT_DETAILS_CONTENT_TYPE ||
    process.env.NEXT_PUBLIC_CONTENTFUL_EVENT_DETAILS_CONTENT_TYPE ||
    process.env.VITE_CONTENTFUL_EVENT_DETAILS_CONTENT_TYPE ||
    'eventDetails',
  stayContentType:
    process.env.CONTENTFUL_STAY_CONTENT_TYPE ||
    process.env.NEXT_PUBLIC_CONTENTFUL_STAY_CONTENT_TYPE ||
    process.env.VITE_CONTENTFUL_STAY_CONTENT_TYPE ||
    'stay',
  contactContentType:
    process.env.CONTENTFUL_CONTACT_CONTENT_TYPE ||
    process.env.NEXT_PUBLIC_CONTENTFUL_CONTACT_CONTENT_TYPE ||
    process.env.VITE_CONTENTFUL_CONTACT_CONTENT_TYPE ||
    'contactUs',
  privacyPolicyContentType:
    process.env.CONTENTFUL_PRIVACY_POLICY_CONTENT_TYPE ||
    process.env.NEXT_PUBLIC_CONTENTFUL_PRIVACY_POLICY_CONTENT_TYPE ||
    process.env.VITE_CONTENTFUL_PRIVACY_POLICY_CONTENT_TYPE ||
    'privacyPolicy',
  termsConditionContentType:
    process.env.CONTENTFUL_TERMS_CONDITION_CONTENT_TYPE ||
    process.env.NEXT_PUBLIC_CONTENTFUL_TERMS_CONDITION_CONTENT_TYPE ||
    process.env.VITE_CONTENTFUL_TERMS_CONDITION_CONTENT_TYPE ||
    'termsCondition',
  revalidateSeconds:
    Number(
      process.env.CONTENTFUL_REVALIDATE_SECONDS ||
        process.env.NEXT_PUBLIC_CONTENTFUL_REVALIDATE_SECONDS ||
        process.env.VITE_CONTENTFUL_REVALIDATE_SECONDS ||
        60,
    ) || 60,
}

const homePageContentTypes = [
  contentfulConfig.homePageContentType,
  contentfulConfig.contentType,
  'homePage',
  'home-page',
  'homepage',
].filter(Boolean)

const footerContentTypes = [
  contentfulConfig.footerContentType,
  'footer',
  'siteFooter',
  'site-footer',
].filter(Boolean)

const headerContentTypes = [
  contentfulConfig.headerContentType,
  'header',
  'siteHeader',
  'site-header',
].filter(Boolean)

const aboutContentTypes = [
  contentfulConfig.aboutContentType,
  'about',
  'aboutPage',
  'about-page',
].filter(Boolean)

const overviewContentTypes = [
  contentfulConfig.overviewContentType,
  'overview',
  'overviewPage',
  'overview-page',
].filter(Boolean)

const overviewLocationContentTypes = [
  contentfulConfig.overviewLocationContentType,
  'pattooCastleLocation',
  'pattoo-castle-location',
  'overviewLocation',
  'overview-location',
  'overviewLocationPage',
  'overview-location-page',
].filter(Boolean)

const gettingHereContentTypes = [
  contentfulConfig.gettingHereContentType,
  'gettingHere',
  'getting-here',
  'gettingHerePage',
  'getting-here-page',
].filter(Boolean)

const accommodationContentTypes = [
  contentfulConfig.accommodationContentType,
  'accommodation',
  'accommodationPage',
  'accommodation-page',
].filter(Boolean)

const villaInclusionContentTypes = [
  contentfulConfig.villaInclusionContentType,
  'villaInclusions',
].filter(Boolean)

const villaDetailsContentTypes = [
  contentfulConfig.villaDetailsContentType,
  'villaDetails',
].filter(Boolean)

const outdoorsContentTypes = [
  contentfulConfig.outdoorsContentType,
  'outdoors',
].filter(Boolean)

const staffContentTypes = [
  contentfulConfig.staffContentType,
  'staff',
].filter(Boolean)

const foodBeverageContentTypes = [
  contentfulConfig.foodBeverageContentType,
  'foodBeverage',
].filter(Boolean)

const optionalToursActivitiesContentTypes = [
  contentfulConfig.optionalToursActivitiesContentType,
  'optionalToursActivities',
  'optionalToursAndActivities',
  'optional-tours-activities',
  'optional-tours-and-activities',
].filter(Boolean)

const galleryContentTypes = [
  contentfulConfig.galleryContentType,
  'gallery',
  'galleryPage',
  'gallery-page',
].filter(Boolean)

const locationContentTypes = [
  contentfulConfig.locationContentType,
  'location',
  'locationPage',
  'location-page',
].filter(Boolean)

const locationSlugContentTypes = [
  contentfulConfig.locationContentType,
  'location',
].filter(Boolean)

const eventContentTypes = [
  contentfulConfig.eventContentType,
  'event',
  'events',
  'eventPage',
  'event-page',
  'eventsPage',
  'events-page',
].filter(Boolean)

const eventDetailsContentTypes = [
  contentfulConfig.eventDetailsContentType,
  'eventDetails',
  'event-details',
  'eventDetail',
  'event-detail',
].filter(Boolean)

const stayContentTypes = [
  contentfulConfig.stayContentType,
  'stay',
  'stayPage',
  'stay-page',
].filter(Boolean)

const contactContentTypes = [
  contentfulConfig.contactContentType,
  'contactUs',
  'contact-us',
  'contact',
  'contactPage',
  'contact-page',
].filter(Boolean)

const privacyPolicyContentTypes = [
  contentfulConfig.privacyPolicyContentType,
  'privacyPolicy',
  'privacy-policy',
  'privacyPolicyPage',
  'privacy-policy-page',
].filter(Boolean)

const termsConditionContentTypes = [
  contentfulConfig.termsConditionContentType,
  'termsCondition',
  'terms-condition',
  'termsAndCondition',
  'terms-and-condition',
  'termsConditions',
  'terms-conditions',
  'termsConditionPage',
  'terms-condition-page',
].filter(Boolean)

export const isContentfulConfigured =
  Boolean(contentfulConfig.space) && Boolean(contentfulConfig.accessToken)

export const contentfulClient = isContentfulConfigured
  ? createClient({
      space: contentfulConfig.space,
      accessToken: contentfulConfig.accessToken,
      environment: contentfulConfig.environment,
    })
  : null

function resolveContentfulLinks(response) {
  const entries = new Map()
  const assets = new Map()

  for (const entry of response.includes?.Entry || []) {
    entries.set(entry.sys.id, entry)
  }

  for (const asset of response.includes?.Asset || []) {
    assets.set(asset.sys.id, asset)
  }

  function resolveValue(value, resolving = new Set()) {
    if (Array.isArray(value)) {
      return value.map((item) => resolveValue(item, resolving))
    }

    if (!value || typeof value !== 'object') {
      return value
    }

    if (value.sys?.type === 'Link') {
      const target =
        value.sys.linkType === 'Asset'
          ? assets.get(value.sys.id)
          : entries.get(value.sys.id)

      return target ? resolveValue(target, resolving) : value
    }

    if (value.sys?.id && (value.sys.type === 'Entry' || value.sys.type === 'Asset')) {
      if (resolving.has(value.sys.id)) {
        return value
      }

      resolving.add(value.sys.id)
      const resolved = {
        ...value,
        fields: resolveValue(value.fields || {}, resolving),
      }
      resolving.delete(value.sys.id)
      return resolved
    }

    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [
        key,
        resolveValue(item, resolving),
      ]),
    )
  }

  return (response.items || []).map((item) => resolveValue(item))
}

async function getEntriesByContentType(contentType, query = {}) {
  if (!isContentfulConfigured || !contentType) {
    return []
  }

  const params = new URLSearchParams({
    access_token: contentfulConfig.accessToken,
    content_type: contentType,
    include: '2',
    limit: '1',
    order: '-sys.updatedAt',
  })

  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== null && value !== '') {
      params.set(key, String(value))
    }
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 8000)
  const response = await fetch(
    `https://cdn.contentful.com/spaces/${contentfulConfig.space}/environments/${contentfulConfig.environment}/entries?${params}`,
    {
      next: { revalidate: contentfulConfig.revalidateSeconds },
      signal: controller.signal,
    },
  )

  clearTimeout(timeout)

  if (!response.ok) {
    throw new Error(`Contentful ${contentType} returned ${response.status}`)
  }

  return resolveContentfulLinks(await response.json())
}

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

  for (const contentType of [...new Set(homePageContentTypes)]) {
    try {
      const items = await getEntriesByContentType(contentType)

      if (items[0]) {
        return items[0]
      }
    } catch (error) {
      console.error(`Contentful ${contentType} request failed:`, error)
    }
  }

  return null
}

export async function getFooterEntry() {
  if (!contentfulClient) {
    return null
  }

  for (const contentType of [...new Set(footerContentTypes)]) {
    try {
      const items = await getEntriesByContentType(contentType)

      if (items[0]) {
        return items[0]
      }
    } catch (error) {
      console.error(`Contentful ${contentType} request failed:`, error)
    }
  }

  return null
}

export async function getHeaderEntry() {
  if (!isContentfulConfigured) {
    return null
  }

  for (const contentType of [...new Set(headerContentTypes)]) {
    try {
      const items = await getEntriesByContentType(contentType)

      if (items[0]) {
        return items[0]
      }
    } catch (error) {
      console.error(`Contentful ${contentType} request failed:`, error)
    }
  }

  return null
}

export async function getAboutEntry() {
  if (!isContentfulConfigured) {
    return null
  }

  for (const contentType of [...new Set(aboutContentTypes)]) {
    try {
      const items = await getEntriesByContentType(contentType)

      if (items[0]) {
        return items[0]
      }
    } catch (error) {
      console.error(`Contentful ${contentType} request failed:`, error)
    }
  }

  return null
}

export async function getOverviewEntry() {
  if (!isContentfulConfigured) {
    return null
  }

  for (const contentType of [...new Set(overviewContentTypes)]) {
    try {
      const items = await getEntriesByContentType(contentType)

      if (items[0]) {
        return items[0]
      }
    } catch (error) {
      console.error(`Contentful ${contentType} request failed:`, error)
    }
  }

  return null
}

export async function getOverviewLocationEntry() {
  if (!isContentfulConfigured) {
    return null
  }

  for (const contentType of [...new Set(overviewLocationContentTypes)]) {
    try {
      const items = await getEntriesByContentType(contentType)

      if (items[0]) {
        return items[0]
      }
    } catch (error) {
      console.error(`Contentful ${contentType} request failed:`, error)
    }
  }

  return null
}

export async function getGettingHereEntry() {
  if (!isContentfulConfigured) {
    return null
  }

  for (const contentType of [...new Set(gettingHereContentTypes)]) {
    try {
      const items = await getEntriesByContentType(contentType)

      if (items[0]) {
        return items[0]
      }
    } catch (error) {
      console.error(`Contentful ${contentType} request failed:`, error)
    }
  }

  return null
}

export async function getAccommodationEntry() {
  if (!isContentfulConfigured) {
    return null
  }

  for (const contentType of [...new Set(accommodationContentTypes)]) {
    try {
      const items = await getEntriesByContentType(contentType)

      if (items[0]) {
        return items[0]
      }
    } catch (error) {
      console.error(`Contentful ${contentType} request failed:`, error)
    }
  }

  return null
}

export async function getVillaInclusionEntry() {
  if (!isContentfulConfigured) {
    return null
  }

  for (const contentType of [...new Set(villaInclusionContentTypes)]) {
    try {
      const items = await getEntriesByContentType(contentType)

      if (items[0]) {
        return items[0]
      }
    } catch (error) {
      console.error(`Contentful ${contentType} request failed:`, error)
    }
  }

  return null
}

export async function getVillaDetailsEntry() {
  if (!isContentfulConfigured) {
    return null
  }

  for (const contentType of [...new Set(villaDetailsContentTypes)]) {
    try {
      const items = await getEntriesByContentType(contentType)

      if (items[0]) {
        return items[0]
      }
    } catch (error) {
      console.error(`Contentful ${contentType} request failed:`, error)
    }
  }

  return null
}

export async function getOutdoorsEntry() {
  if (!isContentfulConfigured) {
    return null
  }

  for (const contentType of [...new Set(outdoorsContentTypes)]) {
    try {
      const items = await getEntriesByContentType(contentType)

      if (items[0]) {
        return items[0]
      }
    } catch (error) {
      console.error(`Contentful ${contentType} request failed:`, error)
    }
  }

  return null
}

export async function getStaffEntry() {
  if (!isContentfulConfigured) {
    return null
  }

  for (const contentType of [...new Set(staffContentTypes)]) {
    try {
      const items = await getEntriesByContentType(contentType)

      if (items[0]) {
        return items[0]
      }
    } catch (error) {
      console.error(`Contentful ${contentType} request failed:`, error)
    }
  }

  return null
}

export async function getFoodBeverageEntry() {
  if (!isContentfulConfigured) {
    return null
  }

  for (const contentType of [...new Set(foodBeverageContentTypes)]) {
    try {
      const items = await getEntriesByContentType(contentType)

      if (items[0]) {
        return items[0]
      }
    } catch (error) {
      console.error(`Contentful ${contentType} request failed:`, error)
    }
  }

  return null
}

export async function getOptionalToursActivitiesEntry() {
  if (!isContentfulConfigured) {
    return null
  }

  for (const contentType of [...new Set(optionalToursActivitiesContentTypes)]) {
    try {
      const items = await getEntriesByContentType(contentType)

      if (items[0]) {
        return items[0]
      }
    } catch (error) {
      console.error(`Contentful ${contentType} request failed:`, error)
    }
  }

  return null
}

export async function getOptionalToursActivitiesEntryBySlug(slug) {
  if (!isContentfulConfigured || !slug) {
    return null
  }

  for (const contentType of [...new Set(optionalToursActivitiesContentTypes)]) {
    try {
      const items = await getEntriesByContentType(contentType, {
        'fields.slug': slug,
      })

      if (items[0]) {
        return items[0]
      }
    } catch (error) {
      console.error(`Contentful ${contentType} slug request failed:`, error)
    }
  }

  return null
}

export async function getGalleryEntry() {
  if (!isContentfulConfigured) {
    return null
  }

  for (const contentType of [...new Set(galleryContentTypes)]) {
    try {
      const items = await getEntriesByContentType(contentType)

      if (items[0]) {
        return items[0]
      }
    } catch (error) {
      console.error(`Contentful ${contentType} request failed:`, error)
    }
  }

  return null
}

export async function getLocationEntry() {
  if (!isContentfulConfigured) {
    return null
  }

  for (const contentType of [...new Set(locationContentTypes)]) {
    try {
      const items = await getEntriesByContentType(contentType)

      if (items[0]) {
        return items[0]
      }
    } catch (error) {
      console.error(`Contentful ${contentType} request failed:`, error)
    }
  }

  return null
}

export async function getLocationEntryBySlug(slug) {
  if (!isContentfulConfigured || !slug) {
    return null
  }

  for (const contentType of [...new Set(locationSlugContentTypes)]) {
    try {
      const items = await getEntriesByContentType(contentType, {
        'fields.slug': slug,
      })

      if (items[0]) {
        return items[0]
      }
    } catch (error) {
      console.error(`Contentful ${contentType} slug request failed:`, error)
    }
  }

  return null
}

export async function getEventEntry() {
  if (!isContentfulConfigured) {
    return null
  }

  for (const contentType of [...new Set(eventContentTypes)]) {
    try {
      const items = await getEntriesByContentType(contentType)

      if (items[0]) {
        return items[0]
      }
    } catch (error) {
      console.error(`Contentful ${contentType} request failed:`, error)
    }
  }

  return null
}

export async function getEventDetailsEntryBySlug(slug) {
  if (!isContentfulConfigured || !slug) {
    return null
  }

  for (const contentType of [...new Set(eventDetailsContentTypes)]) {
    try {
      const items = await getEntriesByContentType(contentType, {
        'fields.eventSlug': slug,
      })

      if (items[0]) {
        return items[0]
      }
    } catch (error) {
      console.error(`Contentful ${contentType} request failed:`, error)
    }
  }

  return null
}

export async function getEventDetailsEntries() {
  if (!isContentfulConfigured) {
    return []
  }

  for (const contentType of [...new Set(eventDetailsContentTypes)]) {
    try {
      const items = await getEntriesByContentType(contentType, {
        limit: 100,
      })

      if (items.length > 0) {
        return items
      }
    } catch (error) {
      console.error(`Contentful ${contentType} request failed:`, error)
    }
  }

  return []
}

export async function getStayEntry() {
  if (!isContentfulConfigured) {
    return null
  }

  for (const contentType of [...new Set(stayContentTypes)]) {
    try {
      const items = await getEntriesByContentType(contentType)

      if (items[0]) {
        return items[0]
      }
    } catch (error) {
      console.error(`Contentful ${contentType} request failed:`, error)
    }
  }

  return null
}

export async function getContactEntry() {
  if (!isContentfulConfigured) {
    return null
  }

  for (const contentType of [...new Set(contactContentTypes)]) {
    try {
      const items = await getEntriesByContentType(contentType)

      if (items[0]) {
        return items[0]
      }
    } catch (error) {
      console.error(`Contentful ${contentType} request failed:`, error)
    }
  }

  return null
}

export async function getPrivacyPolicyEntry() {
  if (!isContentfulConfigured) {
    return null
  }

  for (const contentType of [...new Set(privacyPolicyContentTypes)]) {
    try {
      const items = await getEntriesByContentType(contentType)

      if (items[0]) {
        return items[0]
      }
    } catch (error) {
      console.error(`Contentful ${contentType} request failed:`, error)
    }
  }

  return null
}

export async function getLegalPageEntryBySlug(slug) {
  if (!isContentfulConfigured || !slug) {
    return null
  }

  const legalContentTypes = [
    ...termsConditionContentTypes,
    ...privacyPolicyContentTypes,
  ]

  for (const contentType of [...new Set(legalContentTypes)]) {
    try {
      const items = await getEntriesByContentType(contentType, {
        'fields.slug': slug,
      })

      if (items[0]) {
        return items[0]
      }
    } catch (error) {
      console.error(`Contentful ${contentType} slug request failed:`, error)
    }
  }

  return null
}

export async function getTermsConditionEntry() {
  if (!isContentfulConfigured) {
    return null
  }

  for (const contentType of [...new Set(termsConditionContentTypes)]) {
    try {
      const items = await getEntriesByContentType(contentType)

      if (items[0]) {
        return items[0]
      }
    } catch (error) {
      console.error(`Contentful ${contentType} request failed:`, error)
    }
  }

  return null
}

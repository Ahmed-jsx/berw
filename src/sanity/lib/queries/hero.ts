import { client } from '../client'
import { cache } from 'react'

// TypeScript types for Hero data
export interface HeroSlide {
  _id: string
  title: string
  description: string
  image: {
    asset: {
      _ref: string
      _type: 'reference'
    }
    _type: 'image'
  }
  buttonText: string
  order: number
}

export interface HeroSection {
  _id: string
  title: string
  slides: HeroSlide[]
  autoRotateInterval: number
}

// GROQ query to fetch hero section with all slides
export const HERO_SECTION_QUERY = `*[_type == "heroSection"][0] {
  _id,
  title,
  autoRotateInterval,
  "slides": slides[]-> {
    _id,
    title,
    description,
    image,
    buttonText,
    order
  } | order(order asc)
}`

// Cached fetch function - React will deduplicate requests during the same render
// This ensures multiple components calling getHeroData() in the same render
// will only make one request to Sanity
const fetchHeroDataCached = cache(async (): Promise<HeroSection | null> => {
  try {
    // Sanity client with useCdn: true already provides CDN caching
    // This will be cached by Sanity's CDN for fast subsequent requests
    const data = await client.fetch<HeroSection>(HERO_SECTION_QUERY)
    return data
  } catch (error) {
    console.error('Error fetching hero data:', error)
    return null
  }
})

// Function to fetch hero data (exported for use in hooks and server components)
export async function getHeroData(): Promise<HeroSection | null> {
  return fetchHeroDataCached()
}

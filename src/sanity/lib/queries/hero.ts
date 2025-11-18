import { client } from '../client'

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

// Function to fetch hero data
export async function getHeroData(): Promise<HeroSection | null> {
  try {
    const data = await client.fetch<HeroSection>(HERO_SECTION_QUERY)
    return data
  } catch (error) {
    console.error('Error fetching hero data:', error)
    return null
  }
}

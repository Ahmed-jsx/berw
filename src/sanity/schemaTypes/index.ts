import { type SchemaTypeDefinition } from 'sanity'
import { heroSlide } from './heroSlide'
import { heroSection } from './heroSection'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [heroSlide, heroSection],
}

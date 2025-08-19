export type CategorySlug =
  | "classics"
  | "signature-drinks"
  | "matcha"
  | "non-coffee-refreshers"
  | "filter-brewing"
  | "bakery"
  | "sandwiches"
  | "desserts"

export interface Category {
  slug: CategorySlug
  label: string
  image: string
}

export interface Coffee {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: CategorySlug
}

export const categories: Category[] = [
  {
    slug: "classics",
    label: "Classics",
    image: "/bg1.png",
  },
  {
    slug: "signature-drinks",
    label: "Signature Drinks",
    image: "/bg1.png",
  },
  {
    slug: "matcha",
    label: "Matcha",
    image: "/bg1.png",
  },
  {
    slug: "non-coffee-refreshers",
    label: "Non Coffee Refreshers",
    image: "/bg1.png",
  },
  {
    slug: "filter-brewing",
    label: "Filter Brewing",
    image: "/bg1.png",
  },
  {
    slug: "bakery",
    label: "Bakery",
    image: "/bg1.png",
  },
  {
    slug: "sandwiches",
    label: "Sandwiches",
    image: "/bg1.png",
  },
  {
    slug: "desserts",
    label: "Desserts",
    image: "/bg1.png",
  },
]

export const coffees: Coffee[] = [
  // Classics
  {
    id: "cap-1",
    name: "Cappuccino",
    description:
      "Rich espresso with steamed milk and a deep foam cap for a balanced, velvety sip.",
    price: 105,
    category: "classics",
    image: "/bg1.png",
  },
  {
    id: "moc-1",
    name: "Mocha",
    description:
      "Espresso, chocolate, and milk harmonized into a decadent, cozy classic.",
    price: 105,
    category: "classics",
    image: "/bg1.png",
  },
  {
    id: "lat-1",
    name: "Latte",
    description:
      "Silky steamed milk layered over smooth espresso. Simple, creamy, timeless.",
    price: 105,
    category: "classics",
    image: "/bg1.png",
  },
  {
    id: "cj-1",
    name: "Cold Java",
    description:
      "Chilled coffee with bold flavor, served over ice for a crisp finish.",
    price: 105,
    category: "classics",
    image: "/bg1.png",
  },

  // Signature Drinks
  {
    id: "sg-1",
    name: "Caramel Cloud",
    description:
      "Light, airy foam topped with espresso ribbons and caramel drizzle.",
    price: 120,
    category: "signature-drinks",
    image: "/bg1.png",
  },
  {
    id: "sg-2",
    name: "Hazelnut Velvet",
    description:
      "Nutty hazelnut with velvety milk and a double espresso core.",
    price: 120,
    category: "signature-drinks",
    image: "/bg1.png",
  },

  // Matcha
  {
    id: "mt-1",
    name: "Iced Matcha Latte",
    description:
      "Stone-ground matcha whisked with milk over ice. Clean and refreshing.",
    price: 98,
    category: "matcha",
    image: "/bg1.png",
  },

  // Non Coffee Refreshers
  {
    id: "rf-1",
    name: "Citrus Cooler",
    description:
      "Sparkling citrus blend with mint. Bright, zesty, instantly refreshing.",
    price: 85,
    category: "non-coffee-refreshers",
    image: "/bg1.png",
  },
]

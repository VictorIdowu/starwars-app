export interface Character {
  name: string
  height: string
  mass: string
  hair_color: string
  skin_color: string
  eye_color: string
  birth_year: string
  gender: string
  homeworld: string
  films: string[]
  species: string[]
  vehicles: string[]
  starships: string[]
  url: string
  created: string
  edited: string
}

export interface Film {
  title: string
  episode_id: number
  opening_crawl: string
  director: string
  producer: string
  release_date: string
  characters: string[]
  url: string
}

export interface Planet {
  name: string
  climate: string
  terrain: string
  gravity: string
  population: string
  diameter: string
  rotation_period: string
  orbital_period: string
  url: string
}

export interface Species {
  name: string
  classification: string
  designation: string
  language: string
  average_lifespan: string
  average_height: string
  url: string
}

export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export type ViewMode = 'list' | 'grid'

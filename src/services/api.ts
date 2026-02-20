import axios from 'axios'
import type { Character, Film, Planet, Species, PaginatedResponse } from '../types'

const apiClient = axios.create({
  baseURL: 'https://swapi.dev/api',
  timeout: 10000,
  headers: {
    Accept: 'application/json',
  },
})

// SWAPI sometimes returns http:// URLs in nested resources — normalise them
const swapiClient = (url: string) =>
  axios.get(url.replace('http://', 'https://'), {
    timeout: 10000,
    headers: { Accept: 'application/json' },
  })

export const fetchCharacters = async (page = 1): Promise<PaginatedResponse<Character>> => {
  const { data } = await apiClient.get<PaginatedResponse<Character>>('/people/', {
    params: { page },
  })
  return data
}

export const fetchCharacter = async (id: string): Promise<Character> => {
  const { data } = await apiClient.get<Character>(`/people/${id}/`)
  return data
}

export const searchCharacters = async (
  query: string,
): Promise<PaginatedResponse<Character>> => {
  const { data } = await apiClient.get<PaginatedResponse<Character>>('/people/', {
    params: { search: query },
  })
  return data
}

export const fetchFilm = async (url: string): Promise<Film> => {
  const { data } = await swapiClient(url)
  return data as Film
}

export const fetchPlanet = async (url: string): Promise<Planet> => {
  const { data } = await swapiClient(url)
  return data as Planet
}

export const fetchSpecies = async (url: string): Promise<Species> => {
  const { data } = await swapiClient(url)
  return data as Species
}

export const getCharacterId = (url: string): string => {
  const parts = url.split('/').filter(Boolean)
  return parts[parts.length - 1]
}

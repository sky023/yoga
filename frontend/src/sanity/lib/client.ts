import {createClient} from 'next-sanity'

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!
export const apiVersion = '2025-03-20'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  stega: {studioUrl: process.env.NEXT_PUBLIC_SANITY_STUDIO_URL || 'http://localhost:3333'},
})

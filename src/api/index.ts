import redaxios from 'redaxios'

import { API_URL } from '/~/constants/env'

export const fetcher: typeof redaxios = redaxios.create({
  baseURL: API_URL,
})

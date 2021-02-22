import redaxios from 'redaxios'

import { Fetcher } from '/~/types/index'

export function createFetcher(url: string): Fetcher {
  return redaxios.create({
    baseURL: url,
  })
}

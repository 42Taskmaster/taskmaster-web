import { provide, inject, ref, readonly, Ref } from 'vue'
import { getConfiguration } from '../api/configuration'

import { createFetcher } from '/~/api/index'
import { Fetcher } from '/~/types/index'

type FetcherContext = Ref<Fetcher | null>
interface SetFetcherContext {
  (url: string): Promise<Fetcher>
}

export function useFetcherProvider() {
  const context: FetcherContext = ref(null)

  provide<FetcherContext>('fetcher', readonly(context))

  async function setFetcher(url: string): Promise<Fetcher> {
    const fetcher = createFetcher(url)

    await getConfiguration(fetcher)

    context.value = fetcher

    return fetcher
  }

  provide<SetFetcherContext>('set-fetcher', setFetcher)

  return {
    fetcher: context,
  }
}

export function useFetcher() {
  const fetcher = inject('fetcher')

  if (fetcher === undefined)
    throw new Error('useFetcherProvider must be called before useFetcher')

  return fetcher as FetcherContext
}

export function useFetcherSetter() {
  const fetcher = inject('set-fetcher')

  if (fetcher === undefined)
    throw new Error('useFetcherProvider must be called before useFetcherSetter')

  return fetcher as SetFetcherContext
}

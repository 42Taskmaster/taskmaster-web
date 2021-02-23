import { provide, inject, ref, readonly, Ref, watchEffect } from 'vue'
import { useIntervalFn } from '@vueuse/core'

import { getConfiguration } from '/~/api/configuration'
import { getVersion } from '/~/api/version'
import { createFetcher } from '/~/api/index'
import { Fetcher } from '/~/types/index'

interface FetcherWithUrl {
  url: string
  fetcher: Fetcher
}

type FetcherContext = Ref<FetcherWithUrl | null>

interface SetFetcherContext {
  (url: string): Promise<Fetcher>
}

interface ResetFetcherContext {
  (): void
}

export function useFetcherProvider() {
  const context: FetcherContext = ref(null)

  provide<FetcherContext>('fetcher', readonly(context))

  async function setFetcher(url: string): Promise<Fetcher> {
    const fetcher = createFetcher(url)

    await getConfiguration(fetcher)

    context.value = {
      url,
      fetcher,
    }

    return fetcher
  }

  function resetFetcher() {
    context.value = null
  }

  provide<SetFetcherContext>('set-fetcher', setFetcher)
  provide<ResetFetcherContext>('reset-fetcher', resetFetcher)

  async function ping() {
    const fetcher = context.value?.fetcher
    if (fetcher === undefined)
      return

    try {
      await getVersion(fetcher)
    }
    catch (err) {
      console.error(err)

      resetFetcher()
    }
  }

  const { resume, pause } = useIntervalFn(ping, 1_000)

  watchEffect(() => {
    if (context.value?.fetcher === undefined) {
      pause()
      return
    }

    resume()
  })

  return {
    fetcher: context,
    setFetcher,
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

export function useFetcherResetter() {
  const fetcher = inject('reset-fetcher')

  if (fetcher === undefined)
    throw new Error('useFetcherProvider must be called before useFetcherResetter')

  return fetcher as ResetFetcherContext
}

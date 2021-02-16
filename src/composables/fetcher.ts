import { provide, inject, reactive } from 'vue'

import { createFetcher } from '/~/api/index'
import { Fetcher } from '/~/types/index'

interface FetcherProvider {
  fetcher?: Fetcher
  valid: boolean
  setValid: (bool: boolean) => void
}

function isFetcherProvider(input: unknown): input is FetcherProvider {
  return (
    typeof input === 'object'
    // && typeof (input as FetcherProvider).fetcher === 'function'
    // && typeof (input as FetcherProvider).valid === 'boolean'
  )
}

export function useFetcherProvider() {
  const context = reactive<FetcherProvider>({
    valid: false,
    setValid: (state) => {
      context.valid = state
    }
  })

  function setFetcher(url: string): Fetcher {
    const fetcher = createFetcher(url)

    context.fetcher = fetcher

    return fetcher
  }

  provide('fetcher', context)

  return {
    setFetcher
  }
}

export function useFetcherAvailable(): boolean {
  const context = inject('fetcher')

  console.log('is fetcher available ?', context)

  if (
    !context
    || !isFetcherProvider(context)
    || context.valid === false
  ) {
    return false
  }

  return true
}

export function useFetcherSetValid(bool: boolean) {
  const context = inject('fetcher')

  console.log('set fetcher context valid property', context)

  if (!context) {
    throw new Error('useFetcherProvider must be called before useFetcherSetValid')
  }
  if (!isFetcherProvider(context)) {
    throw new Error('Invalid context type for useFetcher')
  }

  context.setValid(bool)
}

export function useFetcher(): Fetcher {
  const context = inject('fetcher')

  console.log('use fetcher', context)
  
  if (!context) {
    throw new Error('useFetcherProvider must be called before useFetcher')
  }
  if (!isFetcherProvider(context)) {
    throw new Error('Invalid context type for useFetcher')
  }
  if (context.valid === false) {
    throw new Error('The fetcher is not valid, can not use it')
  }

  return context.fetcher
}

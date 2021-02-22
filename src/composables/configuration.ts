import { computed } from 'vue'
import useSWRV from 'swrv'

import { useFetcher } from './fetcher'
import { getConfiguration } from '/~/api/configuration'

export function useConfiguration() {
  const fetcher = useFetcher()

  const { data, error, mutate } = useSWRV('/configuration', async() => {
    if (fetcher.value?.fetcher === undefined)
      throw new Error('Invalid fetcher')

    return await getConfiguration(fetcher.value.fetcher)
  })

  const configuration = computed<string | undefined>(() => {
    if (error.value || data.value === undefined)
      return undefined

    return data.value
  })

  const isLoading = computed(() => data.value === undefined)

  function reload() {
    mutate(getConfiguration)
  }

  return {
    configuration,
    reload,
    isLoading,
  }
}

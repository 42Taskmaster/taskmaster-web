import { computed, watch } from 'vue'
import useSWRV from 'swrv'

import { useFetcher } from './fetcher'
import { getLogs } from '/~/api/logs'

export function useLogs() {
  const fetcher = useFetcher()

  const { data, error, mutate } = useSWRV('/logs', async() => {
    if (fetcher.value?.fetcher === undefined)
      throw new Error('Invalid fetcher')

    return await getLogs(fetcher.value.fetcher)
  }, {
    refreshInterval: 1_000,
  })

  const logs = computed<string | undefined>(() => {
    if (error.value || data.value === undefined)
      return undefined

    return data.value
  })

  const isLoading = computed(() => data.value === undefined)

  function reload() {
    const fetcherInstance = fetcher.value
    if (fetcherInstance === null)
      return

    mutate(() => getLogs(fetcherInstance.fetcher))
  }

  watch(fetcher, () => {
    reload()
  })

  return {
    logs,
    reload,
    isLoading,
  }
}

import { computed } from 'vue'
import useSWRV from 'swrv'

import { useFetcher } from './fetcher'
import { getLogs } from '/~/api/logs'

export function useLogs() {
  const fetcher = useFetcher()

  const { data, error, mutate } = useSWRV('/logs', () => getLogs(fetcher))

  const logs = computed<string | undefined>(() => {
    if (error.value || data.value === undefined)
      return undefined

    return data.value
  })

  const isLoading = computed(() => data.value === undefined)

  function reload() {
    mutate(getLogs)
  }

  return {
    logs,
    reload,
    isLoading,
  }
}

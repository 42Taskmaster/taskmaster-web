import { computed } from 'vue'
import useSWRV from 'swrv'

import { getConfiguration } from '/~/api/configuration'

export function useConfiguration() {
  const { data, error, mutate } = useSWRV('/configuration', getConfiguration)

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

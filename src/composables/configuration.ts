import { computed, watchEffect } from 'vue'
import useSWRV from 'swrv'
import urlcat from 'urlcat'

import { API_URL } from '/~/constants/env'

async function fetcher(key: string): Promise<unknown> {
  const resp = await fetch(urlcat(API_URL, key))
  const json = await resp.json()

  return json
}

interface ConfigurationData {
  data: string
}

interface ConfigurationResponse {
  result: ConfigurationData[]
}

export function useConfiguration() {
  const { data, error, mutate } = useSWRV('/configuration', fetcher)

  const configuration = computed<string | undefined>(() => {
    if (error.value || data.value === undefined)
      return undefined

    return (data.value as ConfigurationResponse).result[0].data
  })

  const isLoading = computed(() => data.value === undefined)

  function reload() {
    mutate(fetcher)
  }

  return {
    configuration,
    reload,
    isLoading,
  }
}

export async function putConfiguration(data: string): Promise<boolean> {
  try {
    const result = await fetch(urlcat(API_URL, '/configuration'),
      {
        method: 'PUT',
        body: JSON.stringify({ data }),
      })
  }
  catch (e) {
    return false
  }
  return false
}

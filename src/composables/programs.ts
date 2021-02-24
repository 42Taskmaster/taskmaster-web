import { computed, watch } from 'vue'
import useSWRV from 'swrv'

import { useFetcher } from './fetcher'
import { getAllPrograms } from '/~/api/programs'
import { Program } from '/~/types/index'

export function usePrograms() {
  const fetcher = useFetcher()

  const { data, error, mutate } = useSWRV('/status', async() => {
    if (fetcher.value?.fetcher === undefined)
      throw new Error('Invalid fetcher')

    return await getAllPrograms(fetcher.value.fetcher)
  }, {
    refreshInterval: 1_000,
  })

  const programs = computed<Program[]>(() => {
    if (error.value || data.value === undefined)
      return []

    return data.value
  })

  const isLoading = computed(() => data.value === undefined)

  function reload() {
    const fetcherInstance = fetcher.value
    if (fetcherInstance === null)
      return

    mutate(() => getAllPrograms(fetcherInstance.fetcher))
  }

  watch(fetcher, () => {
    reload()
  })

  return {
    programs,
    isLoading,
  }
}

export function useProgram(programId: string, refresh = true) {
  const fetcher = useFetcher()

  const { data, error, mutate } = useSWRV('/status', async() => {
    if (fetcher.value?.fetcher === undefined)
      throw new Error('Invalid fetcher')

    return await getAllPrograms(fetcher.value.fetcher)
  }, {
    refreshInterval: refresh ? 1_000 : 0,
  })

  const program = computed<Program | undefined>(() => {
    if (error.value || data.value === undefined)
      return undefined

    const matchingProgram = data.value.find(({ id }) => id === programId)

    return matchingProgram
  })

  const isLoading = computed(() => data.value === undefined)

  function reload() {
    const fetcherInstance = fetcher.value
    if (fetcherInstance === null)
      return

    mutate(() => getAllPrograms(fetcherInstance.fetcher))
  }

  watch(fetcher, () => {
    reload()
  })

  return {
    program,
    isLoading,
  }
}

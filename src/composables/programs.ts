import { computed } from 'vue'
import useSWRV from 'swrv'

import { getAllPrograms } from '/~/api/programs'
import { Program } from '/~/types/index'

export function usePrograms() {
  const { data, error } = useSWRV('/status', getAllPrograms, {
    refreshInterval: 1_000,
  })

  const programs = computed<Program[]>(() => {
    if (error.value || data.value === undefined)
      return []

    return data.value
  })

  const isLoading = computed(() => data.value === undefined)

  return {
    programs,
    isLoading,
  }
}

export function useProgram(programId: string) {
  const { data, error } = useSWRV('/status', getAllPrograms, {
    refreshInterval: 1_000,
  })

  const program = computed<Program | undefined>(() => {
    if (error.value || data.value === undefined)
      return undefined

    const matchingProgram = data.value.find(({ id }) => id === programId)

    return matchingProgram
  })

  const isLoading = computed(() => data.value === undefined)

  return {
    program,
    isLoading,
  }
}

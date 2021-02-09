import { computed, ComputedRef } from 'vue'
import useSWRV from 'swrv'
import urlcat from 'urlcat'

import { API_URL } from '/~/constants/env'

async function fetcher(key: string): Promise<unknown> {
  const resp = await fetch(urlcat(API_URL, key))
  const json = await resp.json()

  return json
}

export enum ProgramState {
  STARTING = 'STARTING',
  BACKOFF = 'BACKOFF',
  RUNNING = 'RUNNING',
  STOPPING = 'STOPPING',
  STOPPED = 'STOPPED',
  EXITED = 'EXITED',
  FATAL = 'FATAL',
  UNKNOWN = 'UNKNOWN',
}

interface Process {
  id: string
  state: string
}

interface ProgramStatusResponse {
  program_id: string
  program_state: string
  processes: Process[]
}

interface ProgramStatus {
  programId: string
  programState: ProgramState
  processes: Process[]
}

interface ProgramsResponse {
  result: ProgramStatusResponse[]
}

export function usePrograms() {
  const { data, error } = useSWRV('/status', fetcher, {
    refreshInterval: 1_000,
  })

  const programs = computed<ProgramStatus[]>(() => {
    if (error.value || data.value === undefined)
      return []

    const { result: programs } = (data.value as ProgramsResponse)

    const normalizedPrograms: ProgramStatus[] = programs.map(({
      program_id,
      program_state,
      processes,
    }) => ({
      programId: program_id,
      programState: program_state,
      processes,
    }))

    return normalizedPrograms
  })

  const isLoading = computed(() => data.value === undefined)

  return {
    programs,
    isLoading,
  }
}

export function useProgram(programId: string) {
  const { data, error } = useSWRV('/status', fetcher, {
    refreshInterval: 1_000,
  })

  const program = computed<ProgramStatus | undefined>(() => {
    if (error.value || data.value === undefined)
      return undefined

    const { result: programs } = (data.value as ProgramsResponse)

    const matchingProgram = programs.find(({ program_id }) => program_id === programId)
    if (matchingProgram === undefined)
      return undefined

    const {
      processes,
      program_id,
      program_state,
    } = matchingProgram

    return {
      programId: program_id,
      programState: program_state,
      processes,
    }
  })

  const isLoading = computed(() => data.value === undefined)

  return {
    program,
    isLoading,
  }
}

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
  pid: string
  state: string
}

interface ProgramConfiguration {
  name: string
  cmd: string
  numprocs: number
  umask: string
  workingdir: string
  autostart: boolean
  autorestart: string
  exitcodes: number[]
  startretries: number
  starttime: number
  stopsignal: string
  stoptime: number
  stdout: string
  stderr: string
  env: string[]
}

interface Program {
  id: string
  state: ProgramState
  configuration: ProgramConfiguration
  processes: Process[]
}
interface Programs {
  programs: Program[]
}

interface ProgramsResponse {
  result: Programs
}

export function usePrograms() {
  const { data, error } = useSWRV('/status', fetcher, {
    refreshInterval: 1_000,
  })

  const programs = computed<Program[]>(() => {
    if (error.value || data.value === undefined)
      return []

    const programsReponse = (data.value as ProgramsResponse)

    return programsReponse.result.programs
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

  const program = computed<Program | undefined>(() => {
    if (error.value || data.value === undefined)
      return undefined

    const programsReponse = (data.value as ProgramsResponse)
    const programs = programsReponse.result.programs

    const matchingProgram = programs.find(({ id }) => id === programId)

    return matchingProgram
  })

  const isLoading = computed(() => data.value === undefined)

  return {
    program,
    isLoading,
  }
}

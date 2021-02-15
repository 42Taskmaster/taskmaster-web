export interface ResponseWithError {
  error?: string
}

function isResponseWithError(input: unknown): input is ResponseWithError {
  return (
    ['undefined', 'string'].includes(typeof (input as ResponseWithError).error)
  )
}

export interface GetConfigurationData {
  data: string
}

export interface GetConfigurationResponse {
  result: GetConfigurationData
}

export function isGetConfigurationData(input: unknown): input is GetConfigurationData {
  return (
    typeof input === 'object'
    && typeof (input as GetConfigurationData).data === 'string'
  )
}

export function isGetConfigurationResponse(input: unknown): input is GetConfigurationResponse {
  return (
    typeof input === 'object'
    && typeof (input as GetConfigurationResponse).result !== undefined
    && isGetConfigurationData((input as GetConfigurationResponse).result)
  )
}

export interface PutConfigurationResponse extends ResponseWithError {
}

export function isPutConfigurationResponse(input: unknown): input is PutConfigurationResponse {
  return (
    typeof input === 'object'
    && isResponseWithError(input)
  )
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

export interface Process {
  id: string
  pid: string
  state: string
}

export interface ProgramConfiguration {
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

export interface Program {
  id: string
  state: ProgramState
  configuration: ProgramConfiguration
  processes: Process[]
}

export interface Programs {
  programs: Program[]
}

interface GetAllProgramsResponse extends ResponseWithError {
  result: Programs
}

export function isProgram(input: unknown): input is Program {
  return (
    typeof input === 'object'
    && typeof (input as Program).id === 'string'
  )
}

export function isProgramsList(input: unknown): input is Programs {
  return (
    typeof input === 'object'
    && Array.isArray((input as Programs).programs)
    && (input as Programs).programs.every(isProgram)
  )
}

export function isGetAllProgramsResponse(input: unknown): input is GetAllProgramsResponse {
  return (
    typeof input === 'object'
    && isProgramsList((input as GetAllProgramsResponse).result)
  )
}

export interface StartProgramResponse extends ResponseWithError {
}

export function isStartProgramResponse(input: unknown): input is StartProgramResponse {
  return isResponseWithError(input)
}
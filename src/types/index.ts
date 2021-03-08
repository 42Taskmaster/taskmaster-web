import type redaxios from 'redaxios'

export type Fetcher = typeof redaxios

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
  pid: number
  state: string
  startedAt: string
  endedAt: string
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
  env: Record<string, string>
}

export function isProgramConfiguration(input: unknown): input is ProgramConfiguration {
  return (
    typeof input === 'object'
    && input !== null
    && typeof (input as ProgramConfiguration).name === 'string'
  )
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

export interface StopProgramResponse extends ResponseWithError {
}

export function isStopProgramResponse(input: unknown): input is StopProgramResponse {
  return isResponseWithError(input)
}

export interface RestartProgramResponse extends ResponseWithError {
}

export function isRestartProgramResponse(input: unknown): input is RestartProgramResponse {
  return isResponseWithError(input)
}

interface VersionResponse {
  result: string
}

export function isVersionResponse(input: unknown): input is VersionResponse {
  return (
    typeof input === 'object' && typeof (input as VersionResponse).result === 'string'
  )
}

export enum AlertType {
  PRIMARY = 'PRIMARY',
  SUCCESS = 'SUCCESS',
  WARNING = 'WARNING',
  DANGER = 'DANGER',
}

export interface Alert {
  show: boolean
  type: AlertType
  message: string
}

export interface AppSelectOption {
  title: string
  value: string
}

export function isAppSelectOption(input: unknown): input is AppSelectOption {
  return (
    typeof input === 'object'
    && typeof (input as AppSelectOption).title === 'string'
    && typeof (input as AppSelectOption).title === 'string'
  )
}

export interface KeyValueObject {
  key: string | number
  value: unknown
}

export function isKeyValueObject(input: unknown): input is KeyValueObject {
  return (
    typeof input === 'object'
    && ['string', 'number'].includes(typeof (input as KeyValueObject).key)
    && Reflect.has(input as KeyValueObject, 'value')
  )
}

export type AppButtonStyle = 'primary' | 'secondary' | 'outlined'

export enum AppButtonColors {
  white = 'white',
  red = 'red',
  green = 'green',
}

export enum AppButtonSize {
  'x-small' = 'x-small',
  'small' = 'small',
  'base' = 'base',
  'large' = 'large',
  'x-large' = 'x-large',
}

export interface ActionOptions {
  text: string
  icon?: string
  size?: AppButtonSize
  color?: AppButtonColors
  disabled?: boolean
  onClick: () => void
}

export function isActionOptions(input: unknown): input is ActionOptions {
  return (
    typeof input === 'object'
    && input !== null
    && typeof (input as ActionOptions).text === 'string'
  )
}

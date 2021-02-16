import { fetcher } from './index'
import { isStartProgramResponse, isStopProgramResponse, isRestartProgramResponse } from '/~/types/index'

export async function startProgram(programId: string): Promise<void> {
  const { data } = await fetcher.post('/start', {
    program_id: programId,
  })
  if (!isStartProgramResponse(data))
    throw new Error('Received invalid response for POST /start endpoint')
  if (data.error !== undefined)
    throw new Error(`Received error for POST /start endpoint: ${data.error}`)
}

export async function stopProgram(programId: string): Promise<void> {
  const { data } = await fetcher.post('/stop', {
    program_id: programId,
  })
  if (!isStopProgramResponse(data))
    throw new Error('Received invalid response for POST /stop endpoint')
  if (data.error !== undefined)
    throw new Error(`Received error for POST /stop endpoint: ${data.error}`)
}

export async function restartProgram(programId: string): Promise<void> {
  const { data } = await fetcher.post('/restart', {
    program_id: programId,
  })
  if (!isRestartProgramResponse(data))
    throw new Error('Received invalid response for POST /restart endpoint')
  if (data.error !== undefined)
    throw new Error(`Received error for POST /restart endpoint: ${data.error}`)
}

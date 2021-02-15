import { fetcher } from './index'
import { isGetAllProgramsResponse, isStartProgramResponse, Program } from '/~/types/index'

export async function startProgram(programId: string): Promise<void> {
  const { data } = await fetcher.post('/start', {
    program_json: programId,
  })
  if (!isStartProgramResponse(data))
    throw new Error('Received invalid response for POST /start endpoint')
  if (data.error !== undefined)
    throw new Error(`Received error for POST /start endpoint: ${data.error}`)
}

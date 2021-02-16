import { isGetAllProgramsResponse, Program, Fetcher } from '/~/types/index'

export async function getAllPrograms(fetcher: Fetcher): Promise<Program[]> {
  const { data } = await fetcher('/status')
  if (!isGetAllProgramsResponse(data))
    throw new Error('Received invalid response for GET /status point')
  if (data.error !== undefined)
    throw new Error(`Received error for POST /start endpoint: ${data.error}`)

  return data.result.programs
}

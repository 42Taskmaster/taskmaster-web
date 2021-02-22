import { isVersionResponse, Fetcher } from '/~/types/index'

export async function getVersion(fetcher: Fetcher): Promise<string> {
  const { data } = await fetcher.get('/version')
  if (!isVersionResponse(data))
    throw new Error('Received invalid response for GET /version endpoint')

  return data.result
}

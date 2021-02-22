import { isGetConfigurationResponse, isPutConfigurationResponse, Fetcher } from '/~/types/index'

export async function getConfiguration(fetcher: Fetcher): Promise<string> {
  const { data } = await fetcher.get('/configuration')
  if (!isGetConfigurationResponse(data))
    throw new Error('Received invalid response for GET /configuration endpoint')

  return data.result.data
}

export async function putConfiguration(updatedConfiguration: string, fetcher: Fetcher): Promise<void> {
  const { data } = await fetcher.put('/configuration', {
    data: updatedConfiguration,
  })
  if (!isPutConfigurationResponse(data))
    throw new Error('Received invalid response for PUT /configuration endpoint')
  if (data.error !== undefined)
    throw new Error(`Received error for PUT /configuration endpoint: ${data.error}`)
}

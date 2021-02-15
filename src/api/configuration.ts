import { fetcher } from './index'

import { isGetConfigurationResponse, isPutConfigurationResponse } from '/~/types/index'

export async function getConfiguration(): Promise<string> {
  const { data } = await fetcher.get('/configuration')
  if (!isGetConfigurationResponse(data))
    throw new Error('Received invalid response for GET /configuration endpoint')

  return data.result.data
}

export async function putConfiguration(updatedConfiguration: string): Promise<void> {
  const { data } = await fetcher.put('/configuration', {
    data: updatedConfiguration,
  })
  if (!isPutConfigurationResponse(data))
    throw new Error('Received invalid response for PUT /configuration endpoint')
  if (data.error !== undefined)
    throw new Error(`Received error for PUT /configuration endpoint: ${data.error}`)
}

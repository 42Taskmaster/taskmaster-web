import { Fetcher } from '/~/types/index'

export async function getLogs(fetcher: Fetcher): Promise<string> {
  const { data } = await fetcher.get('/logs')

  return data.result.data
}

export async function deleteLogs(fetcher: Fetcher): Promise<void> {
  const { data } = await fetcher.delete('/logs')
  if (data.error !== undefined)
    throw new Error(`Received error for DELETE /logs endpoint: ${data.error}`)
}

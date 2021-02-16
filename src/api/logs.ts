import { fetcher } from './index'

export async function getLogs(): Promise<string> {
  const { data } = await fetcher.get('/logs')

  return data.result.data
}

export async function deleteLogs(): Promise<void> {
  const { data } = await fetcher.delete('/logs')
  if (data.error !== undefined)
    throw new Error(`Received error for DELETE /logs endpoint: ${data.error}`)
}

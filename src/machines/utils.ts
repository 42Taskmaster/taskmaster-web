export function mergeMeta<T>(meta: Record<string, T>): T {
  return Object.keys(meta).reduce((acc, key) => {
    const value = meta[key]

    // Assuming each meta value is an object
    Object.assign(acc, value)

    return acc
  }, {} as T)
}

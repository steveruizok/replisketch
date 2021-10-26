// via https://github.com/bameyrick/throttle-typescript
export function throttle<T extends (...args: any) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => ReturnType<T> {
  let inThrottle: boolean
  let lastResult: ReturnType<T>

  return function (this: any, ...args: any[]): ReturnType<T> {
    if (!inThrottle) {
      inThrottle = true

      setTimeout(() => (inThrottle = false), limit)

      // @ts-ignore
      lastResult = func(...args)
    }

    return lastResult
  }
}

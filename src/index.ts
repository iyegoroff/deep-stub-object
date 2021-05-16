export type DeepPartial<T> = T extends Record<string, unknown>
  ? {
      readonly [P in keyof T]?: DeepPartial<T[P]>
    }
  : T

export type DeepRequired<T> = T extends Record<string, unknown>
  ? {
      readonly [P in keyof T]-?: DeepRequired<T[P]>
    }
  : T

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Func<P extends readonly any[] = readonly any[], R extends any = any> = (...args: P) => R

type Nested = Func | { readonly [prop: string]: Nested }

export function deepStub<T extends Nested>(
  target: DeepPartial<T> | undefined,
  message: (path: readonly string[]) => string
): DeepRequired<T> {
  const iter = (node: Nested, path: readonly string[] = []): unknown => {
    return new Proxy(node, {
      get(record: { readonly [prop: string]: Nested }, prop: string) {
        const nextPath = [...path, prop]
        return typeof record[prop] === 'function'
          ? record[prop]
          : iter(
              record[prop] ??
                (() => {
                  throw new Error(message(nextPath))
                }),
              nextPath
            )
      }
    })
  }

  return iter((target ?? {}) as T) as DeepRequired<T>
}

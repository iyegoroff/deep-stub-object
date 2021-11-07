# deep-stub-object

[![npm](https://img.shields.io/npm/v/deep-stub-object)](https://npm.im/deep-stub-object)
[![CircleCI](https://circleci.com/gh/iyegoroff/deep-stub-object.svg?style=svg)](https://circleci.com/gh/iyegoroff/deep-stub-object)
[![codecov](https://codecov.io/gh/iyegoroff/deep-stub-object/branch/main/graph/badge.svg?t=1520230083925)](https://codecov.io/gh/iyegoroff/deep-stub-object)
![Libraries.io dependency status for latest release](https://img.shields.io/librariesio/release/npm/deep-stub-object)
[![Bundlephobia](https://badgen.net/bundlephobia/minzip/deep-stub-object?label=min+gzip)](https://bundlephobia.com/package/deep-stub-object)
[![npm](https://img.shields.io/npm/l/deep-stub-object.svg?t=1495378566925)](https://www.npmjs.com/package/deep-stub-object)

Proxy-backed custom error message instead of `TypeError: x is undefined`

## Getting started

`$ npm i deep-stub-object`

## Reference

```typescript
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

type Func<P extends readonly any[] = readonly any[], R extends any = any> = (...args: P) => R

type Nested = Func | { readonly [prop: string]: Nested }

export function deepStub<T extends Nested>(
  target: DeepPartial<T> | undefined,
  message: (path: readonly string[]) => string
): DeepRequired<T>
```

## Usage

```typescript
import 'ts-jest'
import { deepStub, DeepPartial } from 'deep-stub-object'

type Obj = {
  x: () => 1
  y: { x: () => 'test' }
  z: { y: { x: () => true } }
}

const deepStubObj = (obj?: DeepPartial<Obj>) => deepStub(obj, (path) => path.join('.'))

describe('index', () => {
  test('deepStub - throw', () => {
    const stub = deepStubObj()

    expect(() => stub.x()).toThrowError('x')
    expect(() => stub.y.x()).toThrowError('y.x')
    expect(() => stub.z.y.x()).toThrowError('z.y.x')
  })

  test('deepStub - no throw', () => {
    const stub = deepStubObj({ x: () => 1, z: { y: { x: () => true } } })

    expect(stub.x()).toEqual(1)
    expect(stub.z.y.x()).toEqual(true)
  })
})
```

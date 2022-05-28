import { deepStub, DeepPartial } from '../src'

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

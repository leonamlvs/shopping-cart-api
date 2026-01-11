import { greeting } from '../src/index'

describe('Sample Test', () => {
  it('should pass', () => {
    expect(greeting('World')).toBe('Hello, World!')
  })

  it('should fail', () => {
    expect(greeting('Foo')).not.toBe('Hello, World!')
  })
})

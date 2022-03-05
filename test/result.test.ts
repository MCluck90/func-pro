import { Result } from '~/result'

describe('Ok', () => {
  test('Creates an Ok value', () => {
    const result = Result.Ok(10)
    expect(result.unwrap()).toBe(10)
  })
})

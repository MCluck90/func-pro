import { Option } from '~/option'

describe('Some', () => {
  test('Creates an Option with a value', () => {
    const option = Option.Some(10)
    expect(option.unwrap()).toBe(10)
  })
})

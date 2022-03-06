import { Option } from '~/option'

describe('and', () => {
  test('Returns None if value is None', () => {
    expect(Option.None.and(Option.Some(10))).toBe(Option.None)
  })

  test('Returns None if other is None', () => {
    expect(Option.Some(10).and(Option.None)).toBe(Option.None)
  })

  test('Returns other if both are Some', () => {
    const other = Option.Some(10)
    expect(Option.Some(1).and(other)).toBe(other)
  })
})

describe('andThen', () => {
  test('Returns None if value is None', () => {
    expect(Option.None.andThen(() => Option.Some(10))).toBe(Option.None)
  })

  test('Returns result of function if value is Some', () => {
    expect(
      Option.Some(10)
        .andThen((value) => Option.Some(value.toString()))
        .unwrap(),
    ).toBe('10')
  })
})

describe('equals', () => {
  test('Returns true if both are None', () => {
    expect(Option.None.equals(Option.None)).toBe(true)
  })

  test('Returns false if one is Some and the other is None', () => {
    const none = Option.None as Option<number>
    expect(none.equals(Option.Some(10))).toBe(false)
    expect(Option.Some(10).equals(none)).toBe(false)
  })

  test('Returns false if both are Some but inner values are different', () => {
    expect(Option.Some(10).equals(Option.Some(20))).toBe(false)
  })

  test('Returns true if both are Some and have same inner value', () => {
    expect(Option.Some(10).equals(Option.Some(10))).toBe(true)
  })
})

describe('filter', () => {
  test('Returns None if value is None', () => {
    expect(Option.None.filter(() => true)).toBe(Option.None)
  })

  test('Returns None if inner value does not match predicate', () => {
    expect(Option.Some(10).filter((value) => value !== 10)).toBe(Option.None)
  })

  test('Returns Some with value if inner value matches predicate', () => {
    expect(
      Option.Some(10)
        .filter((value) => value === 10)
        .unwrap(),
    ).toBe(10)
  })
})

describe('isNone', () => {
  test('Returns true for None', () => {
    expect(Option.None.isNone()).toBe(true)
  })

  test('Returns false for Some', () => {
    expect(Option.Some(10).isNone()).toBe(false)
  })
})

describe('isSome', () => {
  test('Returns true for Some', () => {
    expect(Option.Some(10).isSome()).toBe(true)
  })

  test('Returns false for None', () => {
    expect(Option.None.isSome()).toBe(false)
  })
})

describe('letSome', () => {
  test('Runs function if value is Some', () => {
    const fn = jest.fn()
    Option.Some(10).letSome((value) => {
      expect(value).toBe(10)
      fn()
    })
    expect(fn).toHaveBeenCalledTimes(1)
  })

  test('Does not run function if value is None', () => {
    const fn = jest.fn()
    Option.None.letSome(fn)
    expect(fn).not.toHaveBeenCalled()
  })
})

describe('map', () => {
  test('Does nothing if value is None', () => {
    expect(Option.None.map(() => 10)).toBe(Option.None)
  })

  test('Returns Some value with new mapped value', () => {
    expect(
      Option.Some(10)
        .map((value) => value.toString())
        .unwrap(),
    ).toBe('10')
  })
})

describe('mapOr', () => {
  test('Returns mapped value if Some', () => {
    expect(
      Option.Some(10)
        .mapOr('hello', (value) => value.toString())
        .unwrap(),
    ).toBe('10')
  })

  test('Returns default value if None', () => {
    expect(Option.None.mapOr('hello', () => 'goodbye').unwrap()).toBe('hello')
  })
})

describe('mapOrElse', () => {
  test('Returns mapped value if Some', () => {
    expect(
      Option.Some(10)
        .mapOrElse(
          () => 'hello',
          (value) => value.toString(),
        )
        .unwrap(),
    ).toBe('10')
  })

  test('Returns result of given function when None', () => {
    expect(
      Option.None.mapOrElse(
        () => 'hello',
        () => 'goodbye',
      ).unwrap(),
    ).toBe('hello')
  })
})

describe('match', () => {
  test('Returns result from Some branch when value is Some', () => {
    expect(
      Option.Some(10).match({
        Some: (value) => value.toString(),
        None: () => 'goodbye',
      }),
    ).toBe('10')
  })

  test('Returns result from None branch when value is None', () => {
    expect(
      Option.None.match({
        Some: () => 'hello',
        None: () => 'goodbye',
      }),
    ).toBe('goodbye')
  })
})

describe('or', () => {
  test('Returns original value if Some', () => {
    const original = Option.Some(10)
    const other = Option.Some(20)
    expect(original.or(other)).toBe(original)
  })

  test('Returns other if original value is None', () => {
    const original = Option.None as Option<number>
    const other = Option.Some(20)
    expect(original.or(other)).toBe(other)
  })
})

describe('orElse', () => {
  test('Returns original value if Some', () => {
    const original = Option.Some(10)
    const other = Option.Some(20)
    expect(original.orElse(() => other)).toBe(original)
  })

  test('Returns other if original value is None', () => {
    const original = Option.None as Option<number>
    const other = Option.Some(20)
    expect(original.orElse(() => other)).toBe(other)
  })
})

describe('toArray', () => {
  test('Returns array with single element if Some', () => {
    const result = Option.Some(10).toArray()
    expect(result).toHaveLength(1)
    expect(result[0]).toBe(10)
  })

  test('Returns an empty array if None', () => {
    const result = Option.None.toArray()
    expect(result).toHaveLength(0)
  })
})

describe('unwrap', () => {
  test('Returns the value of Some', () => {
    expect(Option.Some(10).unwrap()).toBe(10)
  })

  test('Throws an error for None', () => {
    expect(() => Option.None.unwrap()).toThrowError()
  })
})

describe('unwrapOr', () => {
  test('Returns the value of Some', () => {
    expect(Option.Some(10).unwrapOr(20)).toBe(10)
  })

  test('Returns the default value if None', () => {
    const option: Option<number> = Option.None
    expect(option.unwrapOr(20)).toBe(20)
  })
})

describe('unwrapOrElse', () => {
  test('Returns the value of Some', () => {
    expect(Option.Some(10).unwrapOrElse(() => 20)).toBe(10)
  })

  test('Returns the default value if None', () => {
    const option: Option<number> = Option.None
    expect(option.unwrapOrElse(() => 20)).toBe(20)
  })
})

describe('xor', () => {
  test('Returns None if both are None', () => {
    expect(Option.None.xor(Option.None)).toBe(Option.None)
  })

  test('Returns None if both values are Some', () => {
    expect(Option.Some(10).xor(Option.Some(20))).toBe(Option.None)
  })

  test('Returns Some if either of the values are None', () => {
    const none: Option<number> = Option.None
    const some = Option.Some(10)
    expect(none.xor(some)).toBe(some)
    expect(some.xor(none)).toBe(some)
  })
})

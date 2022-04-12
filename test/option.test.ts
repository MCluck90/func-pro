import { Option, Some, None } from '~/option'
import { Err, Ok } from '~/result'

describe('and', () => {
  test('Returns None if value is None', () => {
    expect(None.and(Some(10))).toBe(None)
  })

  test('Returns None if other is None', () => {
    expect(Some(10).and(None)).toBe(None)
  })

  test('Returns other if both are Some', () => {
    const other = Some(10)
    expect(Some(1).and(other)).toBe(other)
  })
})

describe('andThen', () => {
  test('Returns None if value is None', () => {
    expect(None.andThen(() => Some(10))).toBe(None)
  })

  test('Returns result of function if value is Some', () => {
    expect(
      Some(10)
        .andThen((value) => Some(value.toString()))
        .unwrap(),
    ).toBe('10')
  })
})

describe('equals', () => {
  test('Returns true if both are None', () => {
    expect(None.equals(None)).toBe(true)
  })

  test('Returns false if one is Some and the other is None', () => {
    const none = None as Option<number>
    expect(none.equals(Some(10))).toBe(false)
    expect(Some(10).equals(none)).toBe(false)
  })

  test('Returns false if both are Some but inner values are different', () => {
    expect(Some(10).equals(Some(20))).toBe(false)
  })

  test('Returns true if both are Some and have same inner value', () => {
    expect(Some(10).equals(Some(10))).toBe(true)
  })
})

describe('filter', () => {
  test('Returns None if value is None', () => {
    expect(None.filter(() => true)).toBe(None)
  })

  test('Returns None if inner value does not match predicate', () => {
    expect(Some(10).filter((value) => value !== 10)).toBe(None)
  })

  test('Returns Some with value if inner value matches predicate', () => {
    expect(
      Some(10)
        .filter((value) => value === 10)
        .unwrap(),
    ).toBe(10)
  })
})

describe('isNone', () => {
  test('Returns true for None', () => {
    expect(None.isNone()).toBe(true)
  })

  test('Returns false for Some', () => {
    expect(Some(10).isNone()).toBe(false)
  })
})

describe('isSome', () => {
  test('Returns true for Some', () => {
    expect(Some(10).isSome()).toBe(true)
  })

  test('Returns false for None', () => {
    expect(None.isSome()).toBe(false)
  })
})

describe('letSome', () => {
  test('Runs function if value is Some', () => {
    const fn = jest.fn()
    Some(10).letSome((value) => {
      expect(value).toBe(10)
      fn()
    })
    expect(fn).toHaveBeenCalledTimes(1)
  })

  test('Does not run function if value is None', () => {
    const fn = jest.fn()
    None.letSome(fn)
    expect(fn).not.toHaveBeenCalled()
  })
})

describe('map', () => {
  test('Does nothing if value is None', () => {
    expect(None.map(() => 10)).toBe(None)
  })

  test('Returns Some value with new mapped value', () => {
    expect(
      Some(10)
        .map((value) => value.toString())
        .unwrap(),
    ).toBe('10')
  })
})

describe('mapOr', () => {
  test('Returns mapped value if Some', () => {
    expect(
      Some(10)
        .mapOr('hello', (value) => value.toString())
        .unwrap(),
    ).toBe('10')
  })

  test('Returns default value if None', () => {
    expect(None.mapOr('hello', () => 'goodbye').unwrap()).toBe('hello')
  })
})

describe('mapOrElse', () => {
  test('Returns mapped value if Some', () => {
    expect(
      Some(10)
        .mapOrElse(
          () => 'hello',
          (value) => value.toString(),
        )
        .unwrap(),
    ).toBe('10')
  })

  test('Returns result of given function when None', () => {
    expect(
      None.mapOrElse(
        () => 'hello',
        () => 'goodbye',
      ).unwrap(),
    ).toBe('hello')
  })
})

describe('match', () => {
  test('Returns result from Some branch when value is Some', () => {
    expect(
      Some(10).match({
        Some: (value) => value.toString(),
        None: () => 'goodbye',
      }),
    ).toBe('10')
  })

  test('Returns result from None branch when value is None', () => {
    expect(
      None.match({
        Some: () => 'hello',
        None: () => 'goodbye',
      }),
    ).toBe('goodbye')
  })
})

describe('or', () => {
  test('Returns original value if Some', () => {
    const original = Some(10)
    const other = Some(20)
    expect(original.or(other)).toBe(original)
  })

  test('Returns other if original value is None', () => {
    const original = None as Option<number>
    const other = Some(20)
    expect(original.or(other)).toBe(other)
  })
})

describe('orElse', () => {
  test('Returns original value if Some', () => {
    const original = Some(10)
    const other = Some(20)
    expect(original.orElse(() => other)).toBe(original)
  })

  test('Returns other if original value is None', () => {
    const original = None as Option<number>
    const other = Some(20)
    expect(original.orElse(() => other)).toBe(other)
  })
})

describe('ok', () => {
  test('Converts Some to Ok', () => {
    expect(Some(10).ok('error')).toEqual(Ok(10))
  })

  test('Converts None to Err with given value', () => {
    expect(None.ok('error')).toEqual(Err('error'))
  })
})

describe('okOr', () => {
  test('Converts Some to Ok', () => {
    expect(Some(10).okOr(() => 'error')).toEqual(Ok(10))
  })

  test('Converts None to Err with given value', () => {
    expect(None.okOr(() => 'error')).toEqual(Err('error'))
  })
})

describe('toArray', () => {
  test('Returns array with single element if Some', () => {
    const result = Some(10).toArray()
    expect(result).toHaveLength(1)
    expect(result[0]).toBe(10)
  })

  test('Returns an empty array if None', () => {
    const result = None.toArray()
    expect(result).toHaveLength(0)
  })
})

describe('unwrap', () => {
  test('Returns the value of Some', () => {
    expect(Some(10).unwrap()).toBe(10)
  })

  test('Throws an error for None', () => {
    expect(() => None.unwrap()).toThrowError()
  })
})

describe('unwrapOr', () => {
  test('Returns the value of Some', () => {
    expect(Some(10).unwrapOr(20)).toBe(10)
  })

  test('Returns the default value if None', () => {
    const option: Option<number> = None
    expect(option.unwrapOr(20)).toBe(20)
  })
})

describe('unwrapOrElse', () => {
  test('Returns the value of Some', () => {
    expect(Some(10).unwrapOrElse(() => 20)).toBe(10)
  })

  test('Returns the default value if None', () => {
    const option: Option<number> = None
    expect(option.unwrapOrElse(() => 20)).toBe(20)
  })
})

describe('xor', () => {
  test('Returns None if both are None', () => {
    expect(None.xor(None)).toBe(None)
  })

  test('Returns None if both values are Some', () => {
    expect(Some(10).xor(Some(20))).toBe(None)
  })

  test('Returns Some if either of the values are None', () => {
    const none: Option<number> = None
    const some = Some(10)
    expect(none.xor(some)).toBe(some)
    expect(some.xor(none)).toBe(some)
  })
})

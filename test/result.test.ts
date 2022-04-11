import { None } from '~/option'
import { Ok, Err } from '~/result'

describe('Ok', () => {
  test('Creates an Ok value', () => {
    expect(Ok(10).unwrap()).toBe(10)
  })
})

describe('Err', () => {
  test('Creates an Err value', () => {
    expect(Err(10).unwrapErr()).toBe(10)
  })
})

describe('and', () => {
  test('Returns original if value is Err', () => {
    const original = Err('fail')
    const other = Ok('succeed')
    expect(original.and(other).unwrapErr()).toBe(original.unwrapErr())
  })

  test('Returns other if value is Ok', () => {
    const otherOk = Ok('succeed')
    const otherErr = Err('fail')

    expect(Ok('hello').and(otherOk).unwrap()).toBe('succeed')
    expect(Ok<string, string>('hello').and(otherErr).unwrapErr()).toBe('fail')
  })
})

describe('andThen', () => {
  test('Returns original if value is Err', () => {
    const original = Err('fail')
    const other = Ok('succeed')
    expect(original.andThen(() => other).unwrapErr()).toBe(original.unwrapErr())
  })

  test('Returns other if value is Ok', () => {
    const otherOk = Ok('succeed')
    const otherErr = Err('fail')

    expect(
      Ok('hello')
        .andThen(() => otherOk)
        .unwrap(),
    ).toBe('succeed')
    expect(
      Ok<string, string>('hello')
        .andThen(() => otherErr)
        .unwrapErr(),
    ).toBe('fail')
  })
})

describe('equals', () => {
  test('Returns false if one is Err and another is Ok', () => {
    expect(Ok<number, number>(10).equals(Err(10))).toBe(false)
    expect(Err<number, number>(10).equals(Ok(10))).toBe(false)
  })

  test('Returns true if the have the same Err value', () => {
    expect(Err(10).equals(Err(10))).toBe(true)
  })

  test('Returns true if they have the same Ok value', () => {
    expect(Ok(10).equals(Ok(10))).toBe(true)
  })
})

describe('isErr', () => {
  test('Returns true if Err', () => {
    expect(Err(10).isErr()).toBe(true)
  })

  test('Returns false if Ok', () => {
    expect(Ok(10).isErr()).toBe(false)
  })
})

describe('isOk', () => {
  test('Returns true if Ok', () => {
    expect(Ok(10).isOk()).toBe(true)
  })

  test('Returns false if Err', () => {
    expect(Err(10).isOk()).toBe(false)
  })
})

describe('letErr', () => {
  test('Runs a function if the value is Err', () => {
    const fn = jest.fn()
    Err(10).letErr((error) => {
      expect(error).toBe(10)
      fn()
    })

    expect(fn).toHaveBeenCalledTimes(1)
  })

  test('Does not run a function if the value is Ok', () => {
    const fn = jest.fn()
    Ok(10).letErr(fn)
    expect(fn).not.toHaveBeenCalled()
  })
})

describe('letOk', () => {
  test('Runs a function if the value is Ok', () => {
    const fn = jest.fn()
    Ok(10).letOk((value) => {
      expect(value).toBe(10)
      fn()
    })

    expect(fn).toHaveBeenCalledTimes(1)
  })

  test('Does not run a function if the value is Err', () => {
    const fn = jest.fn()
    Err(10).letOk(fn)
    expect(fn).not.toHaveBeenCalled()
  })
})

describe('map', () => {
  test('Maps Ok value to another value', () => {
    expect(
      Ok(10)
        .map((n) => n.toString())
        .unwrap(),
    ).toBe('10')
  })

  test('Does nothing to Err value', () => {
    expect(
      Err(10)
        .map(() => 'fail')
        .unwrapErr(),
    ).toBe(10)
  })
})

describe('mapOr', () => {
  test('Maps Ok value to another value', () => {
    expect(
      Ok(10)
        .mapOr('test', (n) => n.toString())
        .unwrap(),
    ).toBe('10')
  })

  test('Returns default value if result is Err', () => {
    expect(
      Err<number, number>(10)
        .mapOr('test', (n) => n.toString())
        .unwrap(),
    ).toBe('test')
  })
})

describe('mapOrElse', () => {
  test('Maps Ok value to another value', () => {
    expect(
      Ok(10)
        .mapOrElse(
          () => 'test',
          (n) => n.toString(),
        )
        .unwrap(),
    ).toBe('10')
  })

  test('Returns result of function if result is Err', () => {
    expect(
      Err<number, number>(10)
        .mapOrElse(
          () => 'test',
          (n) => n.toString(),
        )
        .unwrap(),
    ).toBe('test')
  })
})

describe('mapErr', () => {
  test('Maps Err value to another value', () => {
    expect(
      Err(10)
        .mapErr((n) => n.toString())
        .unwrapErr(),
    ).toBe('10')
  })

  test('Does nothing to Ok value', () => {
    expect(
      Ok(10)
        .mapErr(() => 'fail')
        .unwrap(),
    ).toBe(10)
  })
})

describe('mapErrOr', () => {
  test('Maps Err value to another value', () => {
    expect(
      Err(10)
        .mapErrOr('test', (n) => n.toString())
        .unwrapErr(),
    ).toBe('10')
  })

  test('Returns default value if result is Ok', () => {
    expect(
      Ok<number, number>(10)
        .mapErrOr('test', (n) => n.toString())
        .unwrapErr(),
    ).toBe('test')
  })
})

describe('mapErrOrElse', () => {
  test('Maps Err value to another value', () => {
    expect(
      Err(10)
        .mapErrOrElse(
          () => 'test',
          (n) => n.toString(),
        )
        .unwrapErr(),
    ).toBe('10')
  })

  test('Returns default value if result is Ok', () => {
    expect(
      Ok<number, number>(10)
        .mapErrOrElse(
          () => 'test',
          (n) => n.toString(),
        )
        .unwrapErr(),
    ).toBe('test')
  })
})

describe('or', () => {
  test('Returns self if value is Ok', () => {
    const result = Ok(10)
    expect(result.or(Ok(20))).toBe(result)
  })

  test('Returns given result if value is Err', () => {
    const result = Err<string, number>('test')
    const other = Ok<number, string>(10)
    expect(result.or(other)).toBe(other)
  })
})

describe('orElse', () => {
  test('Returns self if value is Ok', () => {
    const result = Ok(10)
    expect(result.orElse(() => Ok(20))).toBe(result)
  })

  test('Returns given result if value is Err', () => {
    const result = Err<string, number>('test')
    const other = Ok<number, string>(10)
    expect(result.orElse(() => other)).toBe(other)
  })
})

describe('toArray', () => {
  test('Converts Ok values to arrays', () => {
    expect(Ok(10).toArray()).toEqual([10])
  })

  test('Converts Err values to arrays', () => {
    expect(Err('test').toArray()).toEqual(['test'])
  })
})

describe('unwrap', () => {
  test('Returns value of Ok', () => {
    expect(Ok(10).unwrap()).toBe(10)
  })

  test('Throws an error when value is Err', () => {
    expect(() => Err('test').unwrap()).toThrowError()
  })
})

describe('unwrapOr', () => {
  test('Returns value of Ok', () => {
    expect(Ok(10).unwrapOr(20)).toBe(10)
  })

  test('Returns given value when result is Err', () => {
    expect(Err<string, number>('test').unwrapOr(10)).toBe(10)
  })
})

describe('unwrapOrElse', () => {
  test('Returns value of Ok', () => {
    expect(Ok(10).unwrapOrElse(() => 20)).toBe(10)
  })

  test('Returns result of function when result is Err', () => {
    expect(Err<string, number>('test').unwrapOrElse(() => 10)).toBe(10)
  })
})

describe('unwrapErr', () => {
  test('Returns value of Err', () => {
    expect(Err(10).unwrapErr()).toBe(10)
  })

  test('Throws an error when value is Ok', () => {
    expect(() => Ok('test').unwrapErr()).toThrowError()
  })
})

describe('unwrapErrOr', () => {
  test('Returns value of Err', () => {
    expect(Err(10).unwrapErrOr(20)).toBe(10)
  })

  test('Returns given value when result is Ok', () => {
    expect(Ok<string, number>('test').unwrapErrOr(10)).toBe(10)
  })
})

describe('unwrapErrOrElse', () => {
  test('Returns value of Err', () => {
    expect(Err(10).unwrapErrOrElse(() => 20)).toBe(10)
  })

  test('Returns result of function when result is Ok', () => {
    expect(Ok<string, number>('test').unwrapErrOrElse(() => 10)).toBe(10)
  })
})

describe('ok', () => {
  test('Converts Ok to Some', () => {
    expect(Ok(10).ok().unwrap()).toBe(10)
  })

  test('Converts Err to None', () => {
    expect(Err(10).ok()).toBe(None)
  })
})

describe('err', () => {
  test('Converts Ok to None', () => {
    expect(Ok(10).err()).toBe(None)
  })

  test('Converts Err to Some', () => {
    expect(Err(10).err().unwrap()).toBe(10)
  })
})

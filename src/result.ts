import { identity } from './identity'

/**
 * Represents the result of an operation.
 * Based on Rusts `Result` type.
 * See https://doc.rust-lang.org/std/result/enum.Result.html
 */
export class Result<T, E> {
  private _isOk: boolean
  private _value: T
  private _error: E

  private constructor(isOk: boolean, value: T, error: E) {
    this._isOk = isOk
    this._value = value
    this._error = error
  }

  /**
   * Contains a success value.
   */
  static Ok<T, E = never>(value: T): Result<T, E> {
    return new Result<T, E>(true, value, null as unknown as E)
  }

  /**
   * Contains an error value.
   */
  static Err<E, T = never>(error: E): Result<T, E> {
    return new Result<T, E>(false, null as unknown as T, error)
  }

  /**
   * Returns input if self is `Ok`.
   */
  and<U>(other: Result<U, E>): Result<U, E> {
    if (this.isErr()) {
      return Result.Err(this._error)
    }
    return other
  }

  /**
   * Returns result of function if value is `Ok`.
   */
  andThen<U>(fn: (value: T) => Result<U, E>): Result<U, E> {
    return this.match({
      Ok: fn,
      Err: () => Result.Err(this._error),
    })
  }

  /**
   * Compares two `Result`s for equality.
   */
  equals(other: Result<T, E>): boolean {
    return this.match({
      Ok: (value) =>
        other.match({
          Ok: (otherValue) => value === otherValue,
          Err: () => false,
        }),
      Err: (error) =>
        other.match({
          Ok: () => false,
          Err: (otherError) => error === otherError,
        }),
    })
  }

  /**
   * Returns true if the value is `Err`.
   */
  isErr(): this is Result<never, E> {
    return !this._isOk
  }

  /**
   * Returns true if the value is `Ok`.
   */
  isOk(): this is Result<T, never> {
    return this._isOk
  }

  /**
   * Execute a function if value is `Err`.
   */
  letErr(fn: (error: E) => void): void {
    if (this.isErr()) {
      fn(this._error)
    }
  }

  /**
   * Execute a function if value is `Ok`.
   */
  letOk(fn: (value: T) => void): void {
    if (this.isOk()) {
      fn(this._value)
    }
  }

  /**
   * Maps value of `Ok` to another value.
   */
  map<U>(fn: (value: T) => U): Result<U, E> {
    if (this.isOk()) {
      return Result.Ok(fn(this._value))
    }
    return Result.Err(this._error)
  }

  /**
   * Maps an `Ok` to a value or returns a new `Ok` with the given value.
   */
  mapOr<U>(defaultValue: U, fn: (value: T) => U): Result<U, E> {
    if (this.isOk()) {
      return this.map(fn)
    }
    return Result.Ok(defaultValue)
  }

  /**
   * Maps an `Ok` to a value or returns a new `Ok` based on the result of the given function.
   */
  mapOrElse<U>(defaultValue: () => U, fn: (value: T) => U): Result<U, E> {
    if (this.isOk()) {
      return this.map(fn)
    }
    return Result.Ok(defaultValue())
  }

  /**
   * Maps an `Err` to a value.
   */
  mapErr<U>(fn: (value: E) => U): Result<T, U> {
    if (this.isErr()) {
      return Result.Err(fn(this._error))
    }
    return Result.Ok(this._value)
  }

  /**
   * Maps an `Err` to a value or returns a new `Err` with the given value.
   */
  mapErrOr<U>(defaultValue: U, fn: (error: E) => U): Result<T, U> {
    if (this.isErr()) {
      return this.mapErr(fn)
    }
    return Result.Err(defaultValue)
  }

  /**
   * Maps an `Err` to a value or returns a new `Err` with the result of the given function.
   */
  mapErrOrElse<U>(defaultValue: () => U, fn: (error: E) => U): Result<T, U> {
    if (this.isErr()) {
      return this.mapErr(fn)
    }
    return Result.Err(defaultValue())
  }

  /**
   * Perform pattern matching on the `Result`.
   */
  match<U>(matchers: { Ok: (value: T) => U; Err: (error: E) => U }): U {
    if (this.isOk()) {
      return matchers.Ok(this._value)
    }
    return matchers.Err(this._error)
  }

  /**
   * Returns given `Result` if value is `Err`.
   */
  or(other: Result<T, E>): Result<T, E> {
    if (this.isOk()) {
      return this
    }
    return other
  }

  /**
   * Returns result of function if value is `Err`.
   */
  orElse(fn: () => Result<T, E>): Result<T, E> {
    if (this.isOk()) {
      return this
    }
    return fn()
  }

  /**
   * Converts value to an array.
   */
  toArray(): [T | E] {
    return this.match<[T | E]>({
      Ok: (value) => [value],
      Err: (error) => [error],
    })
  }

  /**
   * Returns `Ok` value.
   * Throws an error if `Result` is `Err`.
   */
  unwrap(): T {
    if (this.isOk()) {
      return this._value
    }

    throw new Error(String(this._error))
  }

  /**
   * Returns value of `Ok` or default value.
   */
  unwrapOr(defaultValue: T): T {
    return this.match({
      Ok: identity,
      Err: () => defaultValue,
    })
  }

  /**
   * Returns value of `Ok` or result of given function.
   */
  unwrapOrElse(fn: () => T): T {
    return this.match({
      Ok: identity,
      Err: () => fn(),
    })
  }

  /**
   * Returns `Err` value.
   * Throws an error if `Result` is `Ok`.
   */
  unwrapErr(): E {
    if (this.isErr()) {
      return this._error
    }

    throw new Error(String(this._value))
  }

  /**
   * Returns `Err` value or default value if `Result` is `Ok`.
   */
  unwrapErrOr(defaultValue: E): E {
    return this.match({
      Err: identity,
      Ok: () => defaultValue,
    })
  }

  /**
   * Returns `Err` value or result of given function if `Result` is `Ok`.
   */
  unwrapErrOrElse(fn: () => E): E {
    return this.match({
      Err: identity,
      Ok: () => fn(),
    })
  }
}

export const Ok = Result.Ok
export const Err = Result.Err

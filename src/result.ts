export class Result<T, E> {
  private _isOk: boolean
  private _value: T
  private _error: E

  private constructor(isOk: boolean, value: T, error: E) {
    this._isOk = isOk
    this._value = value
    this._error = error
  }

  static Ok<T>(value: T): Result<T, never> {
    return new Result<T, never>(true, value, null as never)
  }

  static Err<E>(error: E): Result<never, E> {
    return new Result<never, E>(false, null as never, error)
  }

  isOk(): this is Result<T, never> {
    return this._isOk
  }

  isErr(): this is Result<never, E> {
    return !this._isOk
  }

  unwrap(): T {
    if (this.isOk()) {
      return this._value
    }

    throw new Error(String(this._error))
  }
}

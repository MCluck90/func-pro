export class Option<T> {
  private _isSome: boolean
  private _value: T

  private constructor(isSome: boolean, value: T) {
    this._isSome = isSome
    this._value = value
  }

  static Some<T>(value: T): Option<T> {
    return new Option<T>(true, value)
  }

  static None(): Option<never> {
    return new Option<never>(false, null as never)
  }

  isSome(): boolean {
    return this._isSome
  }

  isNone(): boolean {
    return !this._isSome
  }

  unwrap(): T {
    if (this.isSome()) {
      return this._value
    }

    throw new Error('Cannot unwrap a None value')
  }
}

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

  static readonly None = new Option<never>(false, null as never)

  /**
   * Returns `other` if both `Option`s are `Some`.
   */
  and<U>(other: Option<U>): Option<U> {
    if (this.isNone()) {
      return Option.None
    }
    return other
  }

  /**
   * Returns result of `fn` if value is `Some`.
   */
  andThen<U>(fn: (value: T) => Option<U>): Option<U> {
    return this.match({
      Some: fn,
      None: () => Option.None,
    })
  }

  /**
   * Compares equality of two `Option`s.
   */
  equals(other: Option<T>): boolean {
    if (this.isNone() && other.isNone()) {
      return true
    }
    if (
      (this.isNone() && other.isSome()) ||
      (this.isSome() && other.isNone())
    ) {
      return false
    }

    return this._value === other._value
  }

  /**
   * If value is `Some` and matches `predicate`, return `Some`.
   * Otherwise, return `None`.
   * @param predicate Predicate run against inner value.
   */
  filter(predicate: (value: T) => boolean): Option<T> {
    if (this.isSome() && predicate(this._value)) {
      return Option.Some(this._value)
    }
    return Option.None
  }

  /**
   * Returns true if value is `None`.
   */
  isNone(): boolean {
    return !this._isSome
  }

  /**
   * Returns true if value is `Some`.
   */
  isSome(): boolean {
    return this._isSome
  }

  /**
   * Evaluate function if value is `Some`.
   */
  letSome(fn: (value: T) => void): void {
    if (this.isSome()) {
      fn(this._value)
    }
  }

  /**
   * Maps inner value to another value.
   */
  map<U>(fn: (value: T) => U): Option<U> {
    if (this.isSome()) {
      return Option.Some(fn(this._value))
    }

    return Option.None
  }

  /**
   * Maps inner value if value is `Some`.
   * Otherwise, returns `Option` with default value.
   */
  mapOr<U>(defaultValue: U, fn: (value: T) => U): Option<U> {
    if (this.isSome()) {
      return this.map(fn)
    }
    return Option.Some(defaultValue)
  }

  /**
   * Maps inner value if value is `Some`.
   * Otherwise, returns `Option` with result of given function.
   */
  mapOrElse<U>(defaultValue: () => U, fn: (value: T) => U): Option<U> {
    if (this.isSome()) {
      return this.map(fn)
    }
    return Option.Some(defaultValue())
  }

  /**
   * Match on `Some` or `None`.
   */
  match<U>(matchers: { Some(value: T): U; None(): U }): U {
    if (this.isSome()) {
      return matchers.Some(this._value)
    }
    return matchers.None()
  }

  /**
   * Binary "or" operation.
   * Return original value if value is `Some`.
   * Otherwise, return `other`.
   */
  or(other: Option<T>): Option<T> {
    if (this.isSome()) {
      return this
    }
    return other
  }

  /**
   * Returns result of function if value is `None`.
   */
  orElse(fn: () => Option<T>): Option<T> {
    return this.match({
      Some: () => this,
      None: fn,
    })
  }

  /**
   * Converts `Option` to an array.
   * If `Some`, return an array with the value.
   * If `None`, return an empty array.
   */
  toArray(): [T] | [] {
    if (this.isSome()) {
      return [this._value]
    }
    return []
  }

  /**
   * Returns the value of `Some`.
   * Throws an error if `None`.
   */
  unwrap(): T {
    if (this.isSome()) {
      return this._value
    }

    throw new Error('Cannot unwrap a None value')
  }

  /**
   * Returns the value of `Some` or a default value if `None`.
   */
  unwrapOr(defaultValue: T): T {
    if (this.isSome()) {
      return this._value
    }
    return defaultValue
  }

  /**
   * Returns the value of `Some` or result of function if `None`.
   */
  unwrapOrElse(fn: () => T): T {
    if (this.isSome()) {
      return this._value
    }
    return fn()
  }

  /**
   * Returns `Some` if only one of the `Option`s are a `Some`.
   */
  xor(other: Option<T>): Option<T> {
    if (this.isSome() && other.isNone()) {
      return this
    }
    if (other.isSome() && this.isNone()) {
      return other
    }
    return Option.None
  }
}

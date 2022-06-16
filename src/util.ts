export class Option<T> {
  constructor(private _inner?: T) {}
  static None = <U>() => new Option<U>(undefined);
  static Some = <U>(val: NonNullable<U>) => new Option<U>(val);
  isSome = () => this._inner !== undefined;
  isNone = () => !this.isSome();
  expect(errMsg: string): T {
    if (this.isSome()) return this._inner!;
    throw new Error(errMsg);
  }
  unwrap = (): T => this.expect("Failed to unwrap");
  unwrapOr = (or: T) => (this.isSome() ? this._inner! : or);
  filter = (predicate: (inner: T) => boolean) =>
    this.isNone() ? this : predicate(this._inner!) ? this : new Option<T>();
  flatten<U>(this: Option<Option<U>>): Option<U> {
    return this.isSome() ? this._inner! : new Option();
  }
  map = <U>(f: (inner: T) => U) =>
    this.isSome() ? new Option(f(this._inner!)) : new Option<U>();
  mapOr = <U>(or: U, f: (inner: T) => U) =>
    this.isSome() ? f(this._inner!) : or;
  toString = () => (this.isSome() ? `Some(${"" + this._inner})` : "None");
}

export function sign(n: number) {
  if (n > 0) return 1;
  if (n < 0) return -1;
  return 0;
}

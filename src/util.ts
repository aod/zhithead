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
    this.isNone() ? this : predicate(this._inner!) ? this : Option.None<T>();
  flatten<U>(this: Option<Option<U>>): Option<U> {
    return this.isSome() ? this._inner! : Option.None();
  }
  map = <U>(f: (inner: T) => U) =>
    this.isSome() ? new Option(f(this._inner!)) : Option.None<U>();
  mapOr = <U>(or: U, f: (inner: T) => U) =>
    this.isSome() ? f(this._inner!) : or;
  toString = () => (this.isSome() ? `Some(${"" + this._inner})` : "None");
}

export function sign(n: number) {
  if (n > 0) return 1;
  if (n < 0) return -1;
  return 0;
}

/** NOTE: Mutates array and also returns it for function chaining */
export function shuffle<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export function offsetFromCenter<T>(array: T[], index: number): number {
  return index - Math.floor(array.length / 2);
}

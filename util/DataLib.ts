export interface Stringable {
  toString(): string;
}

export class StringMap<K extends Stringable, V> {
  private readonly _values: {
    [key: string]: V;
  };

  constructor() {
    this._values = {};
  }

  get(key: K): V {
    return this._values[key.toString()];
  }

  put(key: K, value: V): V {
    this._values[key.toString()] = value;
    return value;
  }

  copy(): StringMap<K, V> {
    const this$ = JSON.parse(JSON.stringify(this));
    this$.copy = this.copy;
    this$.get = this.get;
    this$.put = this.put;
    this$.values = this.values;
    this$.entries = this.entries;

    return this$;
  }

  contains(key: K): boolean {
    return this._values[key.toString()] !== undefined;
  }

  values(): V[] {
    return Object.values(this._values);
  }

  entries(): [string, V][] {
    return Object.entries(this._values);
  }

  isEmpty = () => Object.entries(this._values).length > 0;
}

export class StringSet<E extends Stringable> {
  private readonly map: StringMap<E, number>;

  constructor() {
    this.map = new StringMap();
  }

  add(el: E): E {
    this.map.put(el, -1);
    return el;
  }

  remove(el: E): E {
    this.map.put(el, 0);
    return el;
  }

  contains(el: E): boolean {
    return this.map.get(el) === -1;
  }

  copy(): StringSet<E> {
    const this$ = JSON.parse(JSON.stringify(this));
    this$.add = this.add;
    this$.contains = this.contains;
    this$.remove = this.remove;
    this$.copy = this.copy;
    this$.map.get = this.map.get;
    this$.map.put = this.map.put;

    return this$;
  }

  isEmpty = () => this.map.isEmpty();
  get length() {
    return this.map.values().filter((it) => it !== 0).length;
  }
}

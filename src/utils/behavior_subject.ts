export class BehaviorSubject<T> {
  private _value: T;
  private _subscribers = new Set<((value: T) => void)>();

  constructor(initialValue: T) {
    this._value = initialValue;
  }

  next(value: T) {
    this._value = value;
    for (const subscriber of this._subscribers) {
      subscriber(value);
    }
  }

  subscribe(subscriber: (value: T) => void) {
    this._subscribers.add(subscriber);
  }

  unsubscribe(subscriber: (value: T) => void) {
    this._subscribers.delete(subscriber);
  }

  get value() {
    return this._value;
  }
}

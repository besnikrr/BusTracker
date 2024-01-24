import { BehaviorSubject, distinctUntilChanged, filter, map, Observable } from "rxjs";

export class StateService<T> {
  private state$: BehaviorSubject<T> = new BehaviorSubject<T>({} as T);

  protected get state(): T {
    return this.state$.getValue();
  }

  protected set state(newState: Partial<T>) {
    this.state$.next({ ...this.state, ...newState });
  }

  protected select<K>(mapFn: (state: T) => K): Observable<K> {
    return this.state$.pipe(
      filter((state: T) => !!state),
      map((state: T) => mapFn(state)),
      filter((state: K) => !!state),
      distinctUntilChanged()
    );
  }
}

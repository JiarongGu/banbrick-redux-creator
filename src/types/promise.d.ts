declare interface Promise<T> {
  finally<TResult = never>(onFinally?: (() => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
}
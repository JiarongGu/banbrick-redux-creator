export function inject(service: any) {
  return function (target: any, key: string) {
    target[key] = new service();
  }
}
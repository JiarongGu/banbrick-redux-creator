export function prop(value: any) {
  return function (target: any, key: string) {
    if(target[key] == undefined)
      target[key] = value;
  }
}
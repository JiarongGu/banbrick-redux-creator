import { getReduxService } from './ReduxService';

export function service(namespace: string) {
  return function<T extends { new(...args: any[]): {} }>(constructor: T) {
    const prototype = constructor.prototype;
    const serviceBuilder = getReduxService(prototype);
  
    return class extends constructor {
      constructor(...args) {
        super(...args);
  
        // do not build second time
        if(!serviceBuilder.built) {
          const properties = Object.keys(this).reduce((properties, key) => {
            properties[key] = this[key];
            return properties;
          }, {});
          
          serviceBuilder.properties = properties;
          serviceBuilder.build(namespace, prototype);
        }
  
        // remove all properties, so we only get them from prototype
        Object.keys(this).forEach((key) => {
          delete this[key]
        });
      }
    };
  }
}
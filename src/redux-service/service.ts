import { getReduxServiceBuilder } from './ReduxServiceBuilder';
import { Constructor } from '../types';

export function service(namespace: string) {
  return function<T extends Constructor>(constructor: T) {
    const prototype = constructor.prototype;
    const serviceBuilder = getReduxServiceBuilder(prototype);
  
    return class extends constructor {
      constructor(...args : Array<any>) {
        super(...args);
  
        // do not build second time
        if(!serviceBuilder.built) {
          const properties = Object.keys(this).reduce((properties: any, key) => {
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
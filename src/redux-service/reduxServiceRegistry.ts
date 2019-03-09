import { ReduxServiceBuilder } from './ReduxServiceBuilder';

const services = new Map<string, ReduxServiceBuilder>();

export function getReduxServiceBuilder(key: string) {
  let builder = services.get(key);
  if (!builder) {
    builder = new ReduxServiceBuilder();
    services.set(key, builder);
  }
  return builder;
}
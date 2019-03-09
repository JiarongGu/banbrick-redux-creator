import { connectService } from '../connectService';

export function connect(...services: Array<{ new(): {} }>) {
  return connectService(...services) as any;
}
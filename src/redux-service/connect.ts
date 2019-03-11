import { connectService } from './connectService';
import { Constructor } from '../types';

export function connect(...services: Array<Constructor | object>) {
  return connectService(...services) as any;
}
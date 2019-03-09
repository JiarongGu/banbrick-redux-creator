import { connectService } from '../connectService';

export function connect(...reduxServices: Array<Function>) {
  const connectFunc = connectService(...reduxServices) as <TComponent>(component: any) => TComponent;
  return connectFunc;
}
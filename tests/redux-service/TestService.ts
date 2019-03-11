import { service, state, reducer, effect } from "../../src/redux-service";
import { configureStore } from "../../src/configureStore";
import { getReduxServiceBuilder } from "../../src/redux-service/ReduxServiceBuilder";
import { StoreConfiguration } from "../../src/types";

export class TestState {
  name: string = '';
  value: string = '';
}

@service('TestService')
export class TestService {
  @state
  state = new TestState();

  @reducer
  setName(name: string) {
    return ({ ...this.state, name })
  }

  @reducer
  setValue(value: string) {
    return ({ ...this.state, value })
  }

  @effect
  async setAll(name: string, value: string) {
    this.setName(name);
    this.setValue(value);

    return 'effect success';
  }
}

@service('Test2Service')
export class Test2Service {
  name: string = 'test';
  testService = new TestService();
  value = 0;

  @effect
  setName(name: string) {
    this.testService.setName(name);
  }

  @effect
  setProp(callback: (prop: number) => void) {
    callback(++this.value);
  }
}

export function initalizeStore (config?: StoreConfiguration<any, any>) {
  const store = configureStore(config);

  // reset services
  getReduxServiceBuilder(TestService.prototype).built = false;
  getReduxServiceBuilder(Test2Service.prototype).built = false;
  return store;
}
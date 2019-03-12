import { service, state, reducer, effect } from "../../src/redux-service";

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

  get state() {
    return this.testService.state;
  }
}
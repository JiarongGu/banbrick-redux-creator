import { assert } from 'chai';
import * as React from 'react';
import { renderToString } from 'react-dom/server';
import { configureStore, StoreConfiguration, getEffectTasks } from '../src';
import { reducer, state, effect, connectService, service } from '../src/redux-service';
import { Provider } from 'react-redux';
import { getReduxServiceBuilder } from '../src/redux-service/ReduxServiceBuilder';
import { getCurrentStore } from '../src/redux-registry';

class TestState {
  name: string = '';
  value: string = '';
}

@service('TestService')
class TestService {
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
  }
}

@service('Test2Service')
class Test2Service {
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

function initalizeStore (config?: StoreConfiguration<any, any>) {
  const store = configureStore(config);

  // reset services
  getReduxServiceBuilder(TestService.prototype).built = false;
  getReduxServiceBuilder(Test2Service.prototype).built = false;
  return store;
}

describe('redux service', () => {
  it('can use namespace', () => {
    const store = initalizeStore();
    const testService = new TestService();
  });

  it('state should be shared', () => {
    const store = initalizeStore();
    const testService1 = new TestService();
    const testService2 = new TestService();
    assert.equal(testService1.state, testService2.state);
  });

  it('prop can be shared between sevices', () => {
    const store = initalizeStore();
    const testService1 = new Test2Service();
    const testService2 = new Test2Service();

    testService2.setProp((prop) => { assert.equal(1, prop) });
    testService1.setProp((prop) => { assert.equal(2, prop) });
  });
  
  it('effect should work', () => {
    const store = initalizeStore();
    const testService = new TestService();
    testService.setAll('test name', 'test value');
    const state = testService.state;
    assert.equal('test name', state.name);
    assert.equal('test value', state.value);
  });

  it('effect should work with multiple services', () => {
    const store = initalizeStore();
    const testService = new TestService();
    const test2Service = new Test2Service();
    test2Service.setName('new name hahah');
    assert.equal('new name hahah', testService.state.name);
  });

  it('can connect to component', () => {
    const store = initalizeStore();
    const testService = new TestService();
    testService.setAll('test name', 'test value');
    const TestComponent = (props: { TestService: TestService }) => {
      return <div>{props.TestService.state!.name}</div> 
    }
    const ConnectedComponent = connectService(TestService)(TestComponent) as any;
    const app = <Provider store={store}><ConnectedComponent/></Provider>;
    assert.equal('<div>test name</div>', renderToString(app));
  });

  it('can connect to non state service', () => {
    const store = initalizeStore();
    const test2Service = new Test2Service();
    test2Service.setName('test name');
    
    const TestComponent = (props: { TestService: TestService }) => {
      return <div>{props.TestService.state!.name}</div> 
    }
    const ConnectedComponent = connectService(TestService)(TestComponent) as any;
    const app = <Provider store={store}><ConnectedComponent/></Provider>;
    assert.equal('<div>test name</div>', renderToString(app));
  });

  it('can inhirtent the state form initial state', () => {
    const state = {
      name: 'initalized name'
    };
    const store = initalizeStore({
      initalState: {
        TestService: state
      }
    });
    const testService = new TestService();

    assert.equal(state, testService.state);
  });
})
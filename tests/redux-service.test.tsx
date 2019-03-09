import { assert } from 'chai';
import * as React from 'react';
import { renderToString } from 'react-dom/server';
import { configureStore } from '../src';
import { reducer, state, effect, connectService, service } from '../src/redux-service';
import { Provider } from 'react-redux';

class TestState {
  name: string = '';
  value: string = '';
}

@service
class TestService {
  @state(new TestState())
  state!: TestState;

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

@service
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

describe('redux service', () => {
  it('can use namespace', () => {
    const store = configureStore();
    const testService = new TestService();
  });

  it('state should be shared', () => {
    const store = configureStore();
    const testService1 = new TestService();
    const testService2 = new TestService();
    
    assert.equal(testService1.state, testService2.state);
  });

  it('prop can be shared between sevices', () => {
    const store = configureStore();
    const testService1 = new Test2Service();
    const testService2 = new Test2Service();

    testService2.setProp((prop) => { assert.equal(1, prop) });
    testService1.setProp((prop) => { assert.equal(2, prop) });
  });
  
  it('effect should work', () => {
    const store = configureStore();
    const testService = new TestService();
    testService.setAll('test name', 'test value');
    const state = testService.state;
    assert.equal('test name', state.name);
    assert.equal('test value', state.value);
  });

  it('can connect to component', () => {
    const store = configureStore();
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
    const store = configureStore();
    const test2Service = new Test2Service();
    test2Service.setName('test name');
    
    const TestComponent = (props: { TestService: TestService }) => {
      return <div>{props.TestService.state!.name}</div> 
    }
    const ConnectedComponent = connectService(TestService)(TestComponent) as any;
    const app = <Provider store={store}><ConnectedComponent/></Provider>;
    assert.equal('<div>test name</div>', renderToString(app));
  });
})
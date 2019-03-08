import { assert } from 'chai';
import * as React from 'react';
import { renderToString } from 'react-dom/server';
import { configureStore } from '../src';
import { ReduxService, reducer, begin, effect, connectService, inject } from '../src/redux-service';
import { Provider } from 'react-redux';

class TestState {
  name: string = '';
  value: string = '';
}

class TestService extends ReduxService<TestState> {
  @begin
  begin() {
    return new TestState();
  }

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

class Test2Service extends ReduxService<number> {
  @inject(TestService)
  testService!: TestService;

  @effect
  setName(name: string) {
    this.testService.setName(name);
  }
}

describe('redux service', () => {
  it('can use namespace', () => {
    const store = configureStore();
    const testService = new TestService();
    assert.equal('TestService', testService.namespace());
  });

  it('state should be shared', () => {
    const store = configureStore();
    const testService1 = new TestService();
    const testService2 = new TestService();
    testService1.setName('new name');
    
    assert.equal(testService1.state, testService2.state);
  });
  
  it('effect should work', () => {
    const store = configureStore();
    const testService = new TestService();
    testService.setAll('test name', 'test value');
    const state = testService.getState();
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
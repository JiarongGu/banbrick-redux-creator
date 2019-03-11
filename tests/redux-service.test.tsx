import { assert } from 'chai';
import * as React from 'react';
import { renderToString } from 'react-dom/server';
import { connectService } from '../src/redux-service';
import { Provider } from 'react-redux';
import { initalizeStore, TestService, Test2Service } from './redux-service/TestService';
import { Store } from 'redux';

describe('redux service', () => {
  it('can share state between instance', () => {
    const store = initalizeStore();
    const testService1 = new TestService();
    const testService2 = new TestService();
    assert.equal(testService1.state, testService2.state);
  });

  it('can share property between instance', () => {
    const store = initalizeStore();
    const testService1 = new Test2Service();
    const testService2 = new Test2Service();
    testService2.setProp((prop) => { assert.equal(1, prop) });
    testService1.setProp((prop) => { assert.equal(2, prop) });
  });
  
  it('can call multiple reducers from effect', () => {
    const store = initalizeStore();
    const testService = new TestService();
    testService.setAll('test name', 'test value');
    const state = testService.state;
    assert.equal('test name', state.name);
    assert.equal('test value', state.value);
  });

  it('can service call reducers from other service by effect', () => {
    const store = initalizeStore();
    const testService = new TestService();
    const test2Service = new Test2Service();
    test2Service.setName('new name hahah');
    assert.equal('new name hahah', testService.state.name);
  });

  it('can connect to component with state service', () => {
    const store = initalizeStore();
    const testService = new TestService();
    testService.setAll('test name', 'test value');
    const TestComponent = (props: { TestService: TestService }) => {
      return <div>{props.TestService.state!.name}</div> 
    }
    const app = createApp(store, connectService(TestService), TestComponent);
    assert.equal('<div>test name</div>', renderToString(app));
  });

  it('can connect to component with non-state service', () => {
    const store = initalizeStore();
    const test2Service = new Test2Service();
    const TestComponent = (props: { TestService: TestService }) => {
      return <div>{props.TestService.state!.name}</div> 
    }
    test2Service.setName('test name');
    const app = createApp(store, connectService(TestService), TestComponent);
    assert.equal('<div>test name</div>', renderToString(app));
  });

  it('can inherit state from store', () => {
    const state = { name: 'initalized name' };
    const store = initalizeStore({ initalState: { TestService: state } });
    const testService = new TestService();
    assert.equal(state, testService.state);
  });
})

function createApp(store: Store, connecter: Function, component: any) {
  const ConnectedComponent = connecter(component);
  return <Provider store={store}><ConnectedComponent/></Provider>;
}
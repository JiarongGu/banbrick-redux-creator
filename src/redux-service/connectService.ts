import { connect } from 'react-redux';
import { Dispatch } from 'react';
import { AnyAction } from 'redux';
import { getReduxServiceBuilder, ReduxServiceBuilder } from './ReduxServiceBuilder';
import { Constructor } from '../types';

export function connectService(...services: Array<Constructor | object>) {
  const reduxServices = services.map(service => {
    const prototype = typeof service === 'object' ? Object.getPrototypeOf(service) : service.prototype;
    const reduxService = getReduxServiceBuilder(prototype);
    if (!reduxService.built && typeof service !== 'object')
      new service();
    return reduxService
  });

  const namespaces = reduxServices.map(service => service.namespace);
  return connect(
    createMapStateToProps(namespaces),
    createMapDispatchToProps(reduxServices),
    createMergeProps(reduxServices)
  )
}

function createMapStateToProps(namespaces: Array<string>) {
  return function (state: any) {
    return namespaces.reduce((accumulate, namespace) => {
      accumulate[namespace] = state[namespace];
      return accumulate;
    }, {});
  };
}

function createMapDispatchToProps(serviceBuilders: Array<ReduxServiceBuilder>) {
  return function (dispatch: Dispatch<AnyAction>) {
    return serviceBuilders.reduce((accumulate, service) => {
      accumulate[service.namespace] = service.actions;
      return accumulate;
    }, {});
  };
}

function createMergeProps(reduxServices: Array<ReduxServiceBuilder>) {
  return function (stateProps, dispatchProps, ownProps) {
    return reduxServices.reduce((accumulate, service) => {
      const state = service.stateProp ? { [service.stateProp]: stateProps[service.namespace] } : undefined;
      accumulate[service.namespace] = {
        ...dispatchProps[service.namespace],
        ...state
      };
      return accumulate;
    }, { ...ownProps })
  }
}
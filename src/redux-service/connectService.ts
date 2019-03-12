import { connect } from 'react-redux';
import { Dispatch } from 'react';
import { AnyAction } from 'redux';
import { getReduxServiceBuilder, ReduxServiceBuilder } from './ReduxServiceBuilder';
import { Constructor } from '../types';

export function connectService(...services: Array<Constructor | object>) {
  const prototypes = services.map(service => {
    const constructor = typeof service === 'object' ? Object.getPrototypeOf(service) : service.prototype;
    const prototype = Object.getPrototypeOf(constructor);
    return prototype;
  });

  const serviceBuilders = prototypes.map(prototype => {
    const serviceBuilder = getReduxServiceBuilder(prototype);
    if (!serviceBuilder.built)
      new prototype();
    return serviceBuilder
  });

  const namespaces = serviceBuilders.map(service => service.namespace);
  return connect(
    createMapStateToProps(namespaces),
    createMapDispatchToProps(prototypes),
    createMergeProps(serviceBuilders)
  )
}

function createMapStateToProps(namespaces: Array<string>) {
  return function (state: any) {
    return namespaces.reduce((accumulate: any, namespace) => {
      accumulate[namespace] = state && state[namespace];
      return accumulate;
    }, {});
  };
}

function createMapDispatchToProps(prototypes: Array<any>) {
  const ignoredProperties = ['constructor', '_serviceBuilder'];
  return function (dispatch: Dispatch<AnyAction>) {
    return prototypes.reduce((accumulate: any, prototype) => {
      const serviceBuilder = getReduxServiceBuilder(prototype);
      accumulate[serviceBuilder.namespace] = 
        Object.getOwnPropertyNames(prototype)
          .filter(x => !ignoredProperties.includes(x))
          .reduce((a: any, c) => ( a[c] = prototype[c], a ), {});
      return accumulate;
    }, {});
  };
}

function createMergeProps(serviceBuilders: Array<ReduxServiceBuilder>) {
  return function (stateProps: any, dispatchProps: any, ownProps: any) {
    return serviceBuilders.reduce((accumulate, service) => {
      const state = service.stateProp ? { [service.stateProp]: stateProps[service.namespace] } : undefined;
      accumulate[service.namespace] = {
        ...dispatchProps[service.namespace],
        ...state
      };
      return accumulate;
    }, { ...ownProps })
  }
}
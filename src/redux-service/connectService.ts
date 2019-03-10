import { connect } from "react-redux";
import { Dispatch } from "react";
import { AnyAction } from "redux";
import { getReduxService, ReduxService } from "./ReduxService";

export function connectService(...services: Array<{ new(): {} }>) {
  const reduxServices = services.map(service => {
    const reduxService = getReduxService(service.prototype);
    if (!reduxService.built)
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

function createMapDispatchToProps(reduxServices: Array<ReduxService>) {
  return function (dispatch: Dispatch<AnyAction>) {
    return reduxServices.reduce((accumulate, service) => {
      accumulate[service.namespace] = service.actions;
      return accumulate;
    }, {});
  };
}

function createMergeProps(reduxServices: Array<ReduxService>) {
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
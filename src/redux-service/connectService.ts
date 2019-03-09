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
    createMergeProps(namespaces)
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

function createMergeProps(namespaces: Array<string>) {
  return function (stateProps, dispatchProps, ownProps) {
    return namespaces.reduce((accumulate, namespace) => {
      accumulate[namespace] = {
        ...dispatchProps[namespace],
        state: stateProps[namespace]
      };
      return accumulate;
    }, { ...ownProps })
  }
}
import { connect } from "react-redux";
import { Dispatch } from "react";
import { AnyAction } from "redux";
import { getReduxService } from "./ReduxService";

export function connectService(...reduxServices: Array<Function>) {
  const namespaces = reduxServices.map(x => x.name);
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

function createMapDispatchToProps(reduxServices: Array<Function>) {
  return function (dispatch: Dispatch<AnyAction>) {
    return reduxServices.reduce((accumulate, service) => {
      const serviceBuilder = getReduxService(service.prototype);
      accumulate[service.name] = serviceBuilder.actions;
      return accumulate;
    }, {});
  };
}

function createMergeProps(namespaces: Array<string>) {
  return function(stateProps, dispatchProps, ownProps) {
    return namespaces.reduce((accumulate, namespace) => {
      accumulate[namespace] = { 
        ...dispatchProps[namespace],
        state: stateProps[namespace]
      };
      return accumulate;
    }, { ...ownProps })
  }
}
import { connect } from "react-redux";
import { ReduxService } from "./ReduxService";
import { getReduxServiceBuilder } from "./reduxServiceRegistry";

export function connectService(reduxService: any) {
  const service = new reduxService() as unknown as ReduxService<any>;
  const namespace = service.namespace();
  const serviceBuilder = getReduxServiceBuilder(namespace);

  return connect(
    (state: any) => ({ state: state[namespace] }),
    (dispatch) => ({...serviceBuilder.actions }),
    (state, dispatch, own) => ({
      ...own, [namespace]: { ...state, ...dispatch }
    })
  )
}
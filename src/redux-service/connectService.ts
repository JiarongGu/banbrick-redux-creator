import { connect } from "react-redux";
import { ReduxService } from "./ReduxService";

export function connectService(reduxService: any) {
  const service = new reduxService() as unknown as ReduxService<any>;
  const namespace = service.namespace();

  return connect(
    (state: any) => ({ state: state[namespace] }),
    (dispatch) => service._initializer && ({...service._initializer.actions }),
    (state, dispatch, own) => ({
      ...own, [namespace]: { ...state, ...dispatch }
    })
  )
}
import { connect } from "react-redux";
import { ReduxService } from "./ReduxService";

export function connectService(reduxService: any) {
  const service = new reduxService() as unknown as ReduxService<any>;
  const namespace = service.namespace();
  const camelcaseName = namespace.charAt(0).toLowerCase() + namespace.substr(1);

  return connect(
    (state: any) => ({ state: state[namespace] }),
    (dispatch) => service._initializer && ({...service._initializer.actions }),
    (state, dispatch, own) => ({
      ...own, [camelcaseName]: { ...state, ...dispatch }
    })
  )
}
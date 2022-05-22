import { combineReducers } from "redux";
import userDetailsReducer from "./userDetailsReducer";

const reducers = combineReducers({
  userDetail: userDetailsReducer,
});

export default reducers;

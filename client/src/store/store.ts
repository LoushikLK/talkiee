import { configureStore } from "@reduxjs/toolkit";

import reducers from "./reducer";
import thunk from "redux-thunk";

export const store = configureStore({
  reducer: reducers,
  middleware: [thunk],
});

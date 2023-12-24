import { combineReducers } from "redux";
import auth from "./auth";
import globalSlice from "./globalSlice";

export default combineReducers({
    auth,
    theme: globalSlice,
});
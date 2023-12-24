import { combineReducers } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import themeSlice from "./theme";

export default combineReducers({
    auth: authSlice,
    theme: themeSlice,
});

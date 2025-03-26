import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import userReducer from "./reducers/user/userSlice";
import navBarReducer from "./reducers/navBarSlice";
import globalReducer from "./reducers/global/globalSlice";
export const store = configureStore({
  reducer: {
    user: userReducer,
    navBar: navBarReducer,
    global: globalReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "user/addUser",
          "global/showToaster",
          "user/editDetails",
        ],
        ignoredPaths: ["user.file", "global.toasterShow.err"],
      },
    }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
export type AppThunk = ThunkAction<void, RootState, unknown, Action>;

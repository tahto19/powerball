import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import userReducer from "./reducers/user/userSlice";
import navBarReducer from "./reducers/navBarSlice";
import tokenReducers from "./reducers/token/tokenSlice";
import globalReducer from "./reducers/global/globalSlice";
import adminUsers from "./reducers/user/adminUsers";
import costumerSlice from "./reducers/user/costumerUsers";
import ticketSlice from "./reducers/ticket/ticketSlice";
import raffleEntrySlice from "./reducers/raffleEntry/raffleEntrySlice";
import auditTrailSlice from "./reducers/auditTrail/auditTrailSlice";
import winnerSlice from "./reducers/winner/winnerSlice";
import RaffleDrawSlice from "./reducers/RaffleDraw/RaffleDrawSlice";
import exportDataSlice from "./reducers/download/exportDataSlice";
import alphaCodeSlice from "./reducers/alphaCode/alphacodeSlice";
import raffleSlice from "./reducers/raffle/raffleSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    navBar: navBarReducer,
    global: globalReducer,
    token: tokenReducers,
    admin: adminUsers,
    costumer: costumerSlice,
    ticket: ticketSlice,
    raffleEntry: raffleEntrySlice,
    auditTrail: auditTrailSlice,
    winner: winnerSlice,
    raffleDraw: RaffleDrawSlice,
    exportData: exportDataSlice,
    alphaCode: alphaCodeSlice,
    raffle: raffleSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "user/addUser",
          "user/editDetails",
          "global/showToaster",
        ],
        ignoredPaths: [
          "user.file",
          "global.toasterShow.message",
          "global.toasterShow.err",
          "payload.err",
        ],
      },
    }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
export type AppThunk = ThunkAction<void, RootState, unknown, Action>;

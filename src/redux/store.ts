import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import baseApi from "./api/baseApi";
import authReducer from "./features/auth/authSlice";

// A store factory (rather than a shared module singleton) so the Next.js App
// Router creates one store per request on the server — preventing state from
// leaking across users/requests. See:
// https://redux.js.org/usage/nextjs
export const makeStore = () => {
  const store = configureStore({
    reducer: {
      auth: authReducer,
      [baseApi.reducerPath]: baseApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(baseApi.middleware),
  });

  // Enables refetchOnFocus / refetchOnReconnect behaviours.
  setupListeners(store.dispatch);

  return store;
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { TUser } from "@/types/auth";

// ---------------------------------------------------------------------------
// In-memory auth state. Persistence lives elsewhere by design:
//   - localStorage "accessToken" → read by baseApi for the Authorization header
//   - "auth-token"/"auth-role" cookies → read by middleware.ts for SSR gating
// This slice is what components read synchronously (user menu, role checks).
// After a refresh the slice starts empty and is re-hydrated by the getMe query
// — the token layers are the durable source, not this store.
// ---------------------------------------------------------------------------

interface AuthState {
  token: string | null;
  user: TUser | null;
}

const initialState: AuthState = {
  token: null,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ token: string; user: TUser }>,
    ) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
    /** Re-hydration path: getMe succeeded on app load, token already stored. */
    setUser: (state, action: PayloadAction<TUser>) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
    },
  },
});

export const { setCredentials, setUser, logout } = authSlice.actions;

export default authSlice.reducer;

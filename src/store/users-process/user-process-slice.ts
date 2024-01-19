import { createSlice } from '@reduxjs/toolkit';

import { checkAuthAction, loginAction, logoutAction } from '../api-action/api-actions';
import { AuthStatus, NameSpace } from '../../const';

import { UserProcess } from '../../types/sliceTypes';

const initialState: UserProcess = {
  authStatus: AuthStatus.Unknown,
  userData: null,
};

const userProcess = createSlice({
  name: NameSpace.User,
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(checkAuthAction.fulfilled, (state, action) => {
        state.authStatus = AuthStatus.Auth;
        state.userData = action.payload;
      })
      .addCase(checkAuthAction.rejected, (state) => {
        state.authStatus = AuthStatus.NoAuth;
      })

      .addCase(loginAction.fulfilled, (state, action) => {
        state.authStatus = AuthStatus.Auth;
        state.userData = action.payload;
      })
      .addCase(loginAction.rejected, (state) => {
        state.authStatus = AuthStatus.NoAuth;
      })

      .addCase(logoutAction.fulfilled, (state) => {
        state.authStatus = AuthStatus.NoAuth;
        state.userData = null;
      });
  }
});

export default userProcess;


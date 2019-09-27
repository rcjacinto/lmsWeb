import {
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  ActionReducer
} from '@ngrx/store';
import { storageSync } from '@larscom/ngrx-store-storagesync';
import * as fromUser from './user/user.reducer';
import { User } from '../models/user.model';

export interface RootState {
  users: User;
}

export const reducers: ActionReducerMap<RootState> = {
  users: fromUser.reducer
};

export function storageSyncReducer(
  reducer: ActionReducer<any>
): ActionReducer<any> {
  return storageSync<RootState>({
    features: [{ stateKey: 'users' }],
    storage: window.localStorage
  })(reducer);
}

export const selectUserState = createFeatureSelector<User>('users');

export const selectUser = createSelector(
  selectUserState,
  state => state
);

export const selectEmail = createSelector(
  selectUser,
  user => user.email
);

export const selectRole = createSelector(
  selectUser,
  user => user.role
);

export const selectName = createSelector(
  selectUser,
  user => user.name
);

export const selectProfilePic = createSelector(
  selectUser,
  user => user.image
);

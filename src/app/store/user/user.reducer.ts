import { UserActions, UserActionTypes } from './user.action';
import { User } from 'src/app/models/user.model';

// export interface State {
//   users: User;
// }

export const initialState: User = {
  id: '',
  role: '',
  name: {
    first: '',
    last: '',
    mi: ''
  },
  email: '',
  mobile: 0,
  dob: '',
  date: {
    created: new Date(),
    modified: new Date()
  },
  image: '',
  gender: '',
  address: '',
  status: 0
};

export function reducer(state = initialState, action: UserActions): User {
  switch (action.type) {
    case UserActionTypes.SetUser:
      state = action.payload;
      return state;
    case UserActionTypes.RemoveUser:
      state = initialState;
      return state;
    default:
      return state;
  }
}

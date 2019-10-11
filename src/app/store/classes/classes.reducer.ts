import { ClassActions, ClassActionTypes } from './classes.action';
import { Class } from 'src/app/models/class.model';

export const initialState: Class = {
  name: '',
  description: '',
  color: '',
  date: {
    created: new Date(),
    modified: new Date()
  },
  code: '',
  instructor: {
    id: '',
    name: ''
  },
  members: []
};

export function reducer(state = initialState, action: ClassActions): Class {
  switch (action.type) {
    case ClassActionTypes.SetClass:
      state = action.payload;
      return state;
    case ClassActionTypes.RemoveClass:
      state = initialState;
      return state;
    default:
      return state;
  }
}

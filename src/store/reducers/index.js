import { combineReducers } from 'redux';

export default combineReducers({
  pictures: (state) => {
    if (!state) return {};

    return state;
  },
});

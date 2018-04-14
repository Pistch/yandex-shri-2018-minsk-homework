import { combineReducers } from 'redux';

import picturesReducer from './pictures';
import appearanceReducer from './appearance';

export default combineReducers({
  pictures: picturesReducer,
  appearance: appearanceReducer,
});

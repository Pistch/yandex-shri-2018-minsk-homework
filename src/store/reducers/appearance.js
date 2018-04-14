import TYPES from '../types';

const INITIAL_STATE = {
  width: 1024,
  height: 768,
  mobile: true,
  orientation: true,
  screen: 'gallery',
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case TYPES.GET_VIEWPORT:
      return ({
        ...state,
        width: document.documentElement.clientWidth,
        height: document.documentElement.clientHeight,
        mobile: document.documentElement.clientWidth < 768,
        orientation: document.documentElement.clientWidth > document.documentElement.clientHeight,
      });

    case TYPES.SWITCH_SCREEN:
      return ({
        ...state,
        screen: action.payload,
      });

    default:
      return state;
  }
};

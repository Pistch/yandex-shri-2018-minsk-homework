import TYPES from '../types';

const INITIAL_STATE = {
  pictures: [],
  fetching: false,
  selectedPictureIndex: 0,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case TYPES.FETCH_PICTURES:
      return ({
        ...state,
        pictures: [...state.pictures, ...action.payload],
      });

    case TYPES.FETCHING_START:
      return ({ ...state, fetching: true });

    case TYPES.FETCHING_END:
      return ({ ...state, fetching: false });

    case TYPES.SELECT_PICTURE:
      return ({ ...state, selectedPictureIndex: action.payload });

    default:
      return state;
  }
};

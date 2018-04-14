import TYPES from '../types';

export const fetchNext = (offset = 0, limit = 10) => (dispatch) => {
  dispatch({ type: TYPES.FETCHING_START });

  fetch(`/pictures-data?offset=${offset}&count=${limit}`)
    .then(res => res.json())
    .then((data) => {
      dispatch({ type: TYPES.FETCH_PICTURES, payload: data });
      dispatch({ type: TYPES.FETCHING_END });
    });
};

export const getViewport = () => ({
  type: TYPES.GET_VIEWPORT,
});


export const selectPicture = index => ({
  type: TYPES.SELECT_PICTURE,
  payload: index,
});

export const openSlideshow = () => ({
  type: TYPES.SWITCH_SCREEN,
  payload: 'slideshow',
});

export const closeSlideshow = () => ({
  type: TYPES.SWITCH_SCREEN,
  payload: 'gallery',
});

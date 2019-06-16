import {
  GET_MY_FAVORITES,
  TOGGLE_MY_FAVORITES,
  ADD_LISTING_DETAIL_FAVORITES,
  RESET_MY_FAVORITES
} from "../constants/actionTypes";

export const myFavorites = (state = {}, action) => {
  switch (action.type) {
    case GET_MY_FAVORITES:
      return action.payload;
    default:
      return state;
  }
};

export const listIdPostFavorites = (state = [], action) => {
  switch (action.type) {
    case TOGGLE_MY_FAVORITES:
      return action.payload.type === "added"
        ? [...state, action.payload]
        : state.filter(item => item.id !== action.payload.id);
    case ADD_LISTING_DETAIL_FAVORITES:
      return [...state, { id: action.id, type: "added" }];
    case RESET_MY_FAVORITES:
      return [];
    default:
      return state;
  }
};

export const listIdPostFavoritesRemoved = (state = [], action) => {
  switch (action.type) {
    case TOGGLE_MY_FAVORITES:
      return action.payload.type === "removed"
        ? [...state, action.payload]
        : state.filter(item => item.id !== action.payload.id);
    case RESET_MY_FAVORITES:
      return [];
    default:
      return state;
  }
};

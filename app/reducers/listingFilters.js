import { GET_LISTING_FILTERS } from "../constants/actionTypes";

export const listingFilters = (state = [], action) => {
  switch (action.type) {
    case GET_LISTING_FILTERS:
      return action.payload;
    default:
      return state;
  }
};

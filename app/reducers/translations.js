import { GET_TRANSLATIONS } from "../constants/actionTypes";
import translationDefault from "../utils/translationDefault";

export const translations = (state = translationDefault, action) => {
  switch (action.type) {
    case GET_TRANSLATIONS:
      return action.payload;
    default:
      return state;
  }
};

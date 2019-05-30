import { GET_TRANSLATIONS } from "../constants/actionTypes";
import axios from "axios";
import { isEmpty } from "../wiloke-elements";

export const getTranslations = _ => dispatch => {
  return axios
    .get("translations")
    .then(res => {
      dispatch({
        type: GET_TRANSLATIONS,
        payload: isEmpty(res.data.oResults) ? {} : res.data.oResults
      });
    })
    .catch(err => console.log(err.message));
};

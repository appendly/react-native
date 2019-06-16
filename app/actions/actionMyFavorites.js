import {
  GET_MY_FAVORITES,
  TOGGLE_MY_FAVORITES,
  RESET_MY_FAVORITES
} from "../constants/actionTypes";
import axios from "axios";

export const getMyFavorites = _ => dispatch => {
  return axios
    .get("get-my-favorites")
    .then(({ data }) => {
      dispatch({
        type: GET_MY_FAVORITES,
        payload: data
      });
    })
    .catch(err => {
      console.log(err);
    });
};

export const addMyFavorites = id => dispatch => {
  return axios
    .post("add-to-my-favorites", {
      postID: id
    })
    .then(res => {
      const { data } = res;
      data.status === "success" &&
        dispatch({
          type: TOGGLE_MY_FAVORITES,
          payload: {
            id,
            type: data.is
          }
        });
    })
    .catch(err => {
      console.log(err);
    });
};

export const resetMyFavorites = _ => dispatch => {
  dispatch({
    type: RESET_MY_FAVORITES
  });
};

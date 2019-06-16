import * as types from "../constants/actionTypes";
import axios from "axios";

export const getEventDetail = eventId => dispatch => {
  return axios
    .get(`event-detail/${eventId}`)
    .then(res => {
      dispatch({
        type: types.GET_EVENT_DETAIL,
        payload: res.data.oResults
      });
    })
    .catch(err => console.log(err.message));
};

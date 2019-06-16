import {
  GET_MY_NOTIFICATIONS,
  GET_MY_NOTIFICATIONS_LOADMORE,
  GET_MY_NOTIFICATION_ERROR,
  DELETE_MY_NOTIFICATION
} from "../constants/actionTypes";
import axios from "axios";

const POSTS_PER_PAGE = 14;

export const getMyNotifications = _ => dispatch => {
  return axios
    .get("get-my-notifications", {
      params: {
        postsPerPage: POSTS_PER_PAGE
      }
    })
    .then(({ data }) => {
      console.log(data);
      if (data.status === "success") {
        dispatch({
          type: GET_MY_NOTIFICATIONS,
          payload: data
        });
      } else if (data.status === "error") {
        dispatch({
          type: GET_MY_NOTIFICATION_ERROR,
          messageError: data.msg
        });
      }
    })
    .catch(err => console.log(err));
};

export const getMyNotificationsLoadmore = next => async dispatch => {
  return axios
    .get("get-my-notifications", {
      params: {
        page: next,
        postsPerPage: POSTS_PER_PAGE
      }
    })
    .then(({ data }) => {
      data.status === "success" &&
        dispatch({
          type: GET_MY_NOTIFICATIONS_LOADMORE,
          payload: data
        });
    })
    .catch(err => console.log(err));
};

export const deleteMyNotifications = id => dispatch => {
  return axios
    .delete(`delete-my-notification/${id}`)
    .then(({ data }) => {
      if (data.status === "success") {
        dispatch({
          type: DELETE_MY_NOTIFICATION,
          id
        });
      } else if (data.status === "error") {
        dispatch({
          type: DELETE_MY_NOTIFICATION_ERROR,
          message: data.msg
        });
      }
    })
    .catch(err => console.log(err));
};

import {
  LOGIN,
  LOGOUT,
  LOGIN_ERROR,
  LOGIN_LOADING,
  CHECK_TOKEN,
  SIGNUP,
  SIGNUP_ERROR,
  SIGNUP_LOADING
} from "../constants/actionTypes";
import axios from "axios";
const encodeId = id => `___${id}___`;
const decodeId = id => id.replace(/___/g, "");

export const login = user => dispatch => {
  dispatch({
    type: LOGIN_LOADING,
    loading: true
  });
  return axios
    .post("auth", user)
    .then(({ data }) => {
      console.log(data);
      const { token, status, msg } = data;
      if (status === "loggedIn") {
        dispatch({
          type: LOGIN,
          payload:
            status && status !== "error"
              ? {
                  token
                }
              : {}
        });
      } else if (status === "error") {
        dispatch({
          type: LOGIN_ERROR,
          err: msg
        });
      }
      dispatch({
        type: LOGIN_LOADING,
        loading: false
      });
    })
    .catch(err => {
      dispatch({
        type: LOGIN_LOADING,
        loading: false
      });
      console.log(err);
    });
};

export const logout = myID => (dispatch, getState) => {
  const { db } = getState();
  if (!db || !myID) return;
  dispatch({
    type: LOGOUT,
    message: "logout"
  });
  db.ref(`deviceTokens/${encodeId(myID)}/token`).set("");
};

export const checkToken = myID => (dispatch, getState) => {
  return axios
    .get("is-token-living")
    .then(({ data }) => {
      dispatch({
        type: CHECK_TOKEN,
        isLoggedIn: data.status === "success" ? true : false,
        message: !!data.msg ? data.msg : ""
      });
      const { db } = getState();
      if (!db) return;
      if (data.status !== "success") {
        db.ref(`deviceTokens/${encodeId(myID)}/token`).set("");
      }
    })
    .catch(err => console.log(err));
};

export const register = user => dispatch => {
  dispatch({
    type: SIGNUP_LOADING,
    loading: true
  });
  return axios
    .post("signup", user)
    .then(({ data }) => {
      const { token } = data;
      console.log(data);
      if (data.status === "success") {
        dispatch({
          type: SIGNUP,
          payload: { token }
        });
      } else if (data.status === "error") {
        dispatch({
          type: SIGNUP_ERROR,
          err: data.msg
        });
      }
      dispatch({
        type: SIGNUP_LOADING,
        loading: false
      });
    })
    .catch(err => {
      dispatch({
        type: SIGNUP_LOADING,
        loading: false
      });
      console.log(err);
    });
};

import { GET_SIGNUP_FORM } from "../constants/actionTypes";
import axios from "axios";

export const getSignUpForm = _ => dispatch => {
  return axios
    .get("get-signup-fields")
    .then(res => {
      const { data } = res;
      data.status === "success" &&
        dispatch({
          type: GET_SIGNUP_FORM,
          payload: data.oFields
        });
    })
    .catch(err => {
      console.log(err);
    });
};

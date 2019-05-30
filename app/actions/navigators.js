import * as types from "../constants/actionTypes";
import { AsyncStorage } from "react-native";
import axios from "axios";

export const getTabNavigator = _ => dispatch => {
  return axios
    .get("navigators/tabNavigator")
    .then(res => {
      const payload = res.data.oResults.filter(
        item => item.status === "enable"
      );
      dispatch({
        type: types.GET_TAB_NAVIGATOR,
        payload
      });
    })
    .catch(err => console.log(err.message));
};

export const getStackNavigator = _ => dispatch => {
  dispatch({
    type: types.MENU_REQUEST_TIMEOUT,
    isTimeout: false
  });
  return axios
    .get("navigators/stackNavigator")
    .then(res => {
      const payload = res.data.oResults.filter(
        item => item.status === "enable"
      );
      dispatch({
        type: types.GET_STACK_NAVIGATOR,
        payload
      });
      dispatch({
        type: types.MENU_REQUEST_TIMEOUT,
        isTimeout: false
      });
    })
    .catch(err => {
      dispatch({
        type: types.MENU_REQUEST_TIMEOUT,
        isTimeout: true
      });
      console.log(err.message);
    });
};

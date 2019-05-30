import * as types from "../constants/actionTypes";
import axios from "axios";

export const getHomeScreen = _ => dispatch => {
  // dispatch({
  //   type: types.LOADING,
  //   loading: true
  // });
  dispatch({
    type: types.HOME_REQUEST_TIMEOUT,
    isTimeout: false
  });
  return axios
    .get("homepage-sections")
    .then(home => {
      const sectionsData = home.data.oData;
      const sectionsDataArr = Object.keys(sectionsData);
      const getAll = url => axios.get(`homepage-section-detail/${url}`);
      return axios
        .all(sectionsDataArr.map(getAll))
        .then(
          axios.spread((...res) => {
            const payload = res
              .map(item => item.data.oData)
              .filter(item => item !== null);
            dispatch({
              type: types.GET_HOME_SCREEN,
              payload
            });
            // dispatch({
            //   type: types.LOADING,
            //   loading: false
            // });
            dispatch({
              type: types.HOME_REQUEST_TIMEOUT,
              isTimeout: false
            });
          })
        )
        .catch(err => {
          dispatch({
            type: types.HOME_REQUEST_TIMEOUT,
            isTimeout: true
          });
          console.log(err.message);
        });
    })
    .catch(err => {
      dispatch({
        type: types.HOME_REQUEST_TIMEOUT,
        isTimeout: true
      });
      console.log(err.message);
    });
};

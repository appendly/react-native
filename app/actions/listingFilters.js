import { GET_LISTING_FILTERS } from "../constants/actionTypes";
import axios from "axios";

export const getListingFilters = (objPostType, postType) => dispatch => {
  return axios
    .get("search-fields/listing", {
      params: {
        postType
      }
    })
    .then(res => {
      if (res.status === 200) {
        const { oResults } = res.data;
        dispatch({
          type: GET_LISTING_FILTERS,
          payload: [
            oResults.filter(item => item.key === "postType").length > 0
              ? {}
              : objPostType,
            ...oResults
          ]
        });
      }
    })
    .catch(err => console.log(err.message));
};

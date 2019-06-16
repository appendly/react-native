import {
  GET_MY_LISTINGS,
  GET_MY_LISTINGS_LOADMORE,
  GET_MY_LISTING_ERROR
} from "../constants/actionTypes";
import axios from "axios";

const POSTS_PER_PAGE = 12;

export const getMyListings = ({ postType, postStatus }) => dispatch => {
  return axios
    .get("get-my-listings", {
      params: {
        postType,
        postStatus,
        postsPerPage: POSTS_PER_PAGE
      }
    })
    .then(({ data }) => {
      if (data.status === "success") {
        dispatch({
          type: GET_MY_LISTINGS,
          payload: data
        });
      } else if (data.status === "error") {
        dispatch({
          type: GET_MY_LISTING_ERROR,
          messageError: data.msg
        });
      }
    })
    .catch(err => console.log(err));
};

export const getMyListingsLoadmore = ({
  next,
  postType,
  postStatus
}) => async dispatch => {
  return axios
    .get("get-my-listings", {
      params: {
        postType,
        postStatus,
        page: next,
        postsPerPage: POSTS_PER_PAGE
      }
    })
    .then(({ data }) => {
      data.status === "success" &&
        dispatch({
          type: GET_MY_LISTINGS_LOADMORE,
          payload: data
        });
    })
    .catch(err => console.log(err));
};

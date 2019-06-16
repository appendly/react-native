import * as types from "../constants/actionTypes";
import axios from "axios";

const POSTS_PER_PAGE = 10;
const LATEST = 3;

export const getEventDiscussion = (eventId, type) => dispatch => {
  return axios
    .get(`event-detail/${eventId}/discussions`, {
      params: {
        page: 1,
        postsPerPage: type === "latest" ? LATEST : POSTS_PER_PAGE
      }
    })
    .then(res => {
      if (type === "latest") {
        dispatch({
          type: types.GET_EVENT_DISCUSSION_LATEST,
          payload: res.data
        });
      } else {
        dispatch({
          type: types.GET_EVENT_DISCUSSION,
          payload: res.data
        });
      }
    })
    .catch(err => console.log(err.message));
};

export const getEventDiscussionLoadmore = (eventId, next) => dispatch => {
  return axios
    .get(`event-detail/${eventId}/discussions`, {
      params: {
        page: next,
        postsPerPage: POSTS_PER_PAGE
      }
    })
    .then(res => {
      dispatch({
        type: types.GET_EVENT_DISCUSSION_LOADMORE,
        payload: res.data
      });
    })
    .catch(err => console.log(err.message));
};

export const getCommentInDiscussionEvent = discussionId => dispatch => {
  return axios
    .get(`event-detail/${discussionId}/discussions`)
    .then(res => {
      dispatch({
        type: types.GET_COMMENT_DISCUSSION_EVENT,
        payload: res.data
      });
    })
    .catch(err => console.log(err.message));
};

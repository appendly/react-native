import * as types from "../constants/actionTypes";

export const eventDiscussionLatest = (state = { oResults: [] }, action) => {
  switch (action.type) {
    case types.GET_EVENT_DISCUSSION_LATEST:
      return action.payload;
    default:
      return state;
  }
};

export const eventDiscussion = (state = { oResults: [] }, action) => {
  switch (action.type) {
    case types.GET_EVENT_DISCUSSION:
      return action.payload;

    case types.GET_EVENT_DISCUSSION_LOADMORE:
      return {
        ...state,
        next: action.payload.next,
        oResults: [...state.oResults, ...action.payload.oResults]
      };

    default:
      return state;
  }
};

export const commentInDiscussionEvent = (state = { oResults: [] }, action) => {
  switch (action.type) {
    case types.GET_COMMENT_DISCUSSION_EVENT:
      return action.payload;
    default:
      return state;
  }
};

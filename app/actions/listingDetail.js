import * as types from "../constants/actionTypes";
import axios from "axios";
import { filterMax } from "../wiloke-elements";

/**
 * GET LISTING DETAIL
 * @param {*} id listing
 */
export const getListingDetail = id => dispatch => {
  return axios
    .get(`listing-detail/${id}`)
    .then(res => {
      const {
        oReview,
        oFavorite,
        oNavigation,
        oHomeSections
      } = res.data.oResults;
      dispatch({
        type: types.GET_LISTING_DETAIL,
        payload: {
          oReview,
          oFavorite,
          oNavigation,
          oHomeSections
        }
      });
      dispatch({
        type: types.ADD_LISTING_DETAIL_FAVORITES,
        id: oFavorite.isMyFavorite ? id : null
      });
    })
    .catch(err => console.log(err));
};

/**
 * GET LISTING DETAIL DESCRIPTIONS
 * @param {*} id listing
 * @param {*} key = content
 */
export const getListingDescription = (id, key, max) => dispatch => {
  dispatch({
    type: types.LOADING_LISTING_DETAIL,
    loading: true
  });
  dispatch({
    type: types.LISTING_DETAIL_DES_REQUEST_TIMEOUT,
    isTimeout: false
  });
  return axios
    .get(`listing-meta/${id}/${key}`)
    .then(res => {
      const payload = res.data.status === "success" ? [res.data.oResults] : [];
      if (max !== null) {
        dispatch({
          type: types.GET_LISTING_DESTINATION,
          payload
        });
      } else {
        dispatch({
          type: types.GET_LISTING_DESTINATION_ALL,
          payload
        });
        dispatch({
          type: types.LOADING_LISTING_DETAIL,
          loading: false
        });
      }
      // dispatch({
      //   type: types.LISTING_DETAIL_DES_REQUEST_TIMEOUT,
      //   isTimeout: false
      // });
    })
    .catch(err => {
      // dispatch({
      //   type: types.LISTING_DETAIL_DES_REQUEST_TIMEOUT,
      //   isTimeout: true
      // });
      console.log(err.message);
    });
};

/**
 * GET LISTING DETAIL LIST FEATURE
 * @param {*} id listing
 * @param {*} key = tags
 * @param {*} max (maximumItemsOnHome)
 */
export const getListingListFeature = (id, key, max) => dispatch => {
  dispatch({
    type: types.LOADING_LISTING_DETAIL,
    loading: true
  });
  dispatch({
    type: types.LISTING_DETAIL_LIST_REQUEST_TIMEOUT,
    isTimeout: false
  });
  return axios
    .get(`listing-meta/${id}/${key}`, {
      params: {
        maximumItemsOnHome: max !== "" ? max : null
      }
    })
    .then(res => {
      const payload = res.data.status === "success" ? res.data.oResults : [];
      if (max !== null) {
        dispatch({
          type: types.GET_LISTING_LIST_FEATURE,
          payload
        });
      } else {
        dispatch({
          type: types.GET_LISTING_LIST_FEATURE_ALL,
          payload
        });
        dispatch({
          type: types.LOADING_LISTING_DETAIL,
          loading: false
        });
      }
      // dispatch({
      //   type: types.LISTING_DETAIL_LIST_REQUEST_TIMEOUT,
      //   isTimeout: false
      // });
    })
    .catch(err => {
      // dispatch({
      //   type: types.LISTING_DETAIL_LIST_REQUEST_TIMEOUT,
      //   isTimeout: true
      // });
      console.log(err.message);
    });
};

/**
 * GET LISTING DETAIL PHOTOS
 * @param {*} id listing
 * @param {*} key = photos
 * @param {*} max (maximumItemsOnHome)
 */
export const getListingPhotos = (id, key, max) => dispatch => {
  dispatch({
    type: types.LOADING_LISTING_DETAIL,
    loading: true
  });
  dispatch({
    type: types.LISTING_DETAIL_PHOTOS_REQUEST_TIMEOUT,
    isTimeout: false
  });
  return axios
    .get(`listing-meta/${id}/${key}`, {
      params: {
        maximumItemsOnHome: max !== "" ? max : null
      }
    })
    .then(res => {
      const { large, medium } = res.data.oResults;
      const galleryLarge = filterMax(large);
      const galleryMedium = filterMax(medium);
      const gallery = maxItem =>
        res.data.status === "success"
          ? {
              large: !maxItem ? large : galleryLarge(maxItem),
              medium: !maxItem ? medium : galleryMedium(maxItem)
            }
          : {};
      if (max !== null) {
        dispatch({
          type: types.GET_LISTING_PHOTOS,
          payload: gallery(false)
        });
      } else {
        dispatch({
          type: types.GET_LISTING_PHOTOS_ALL,
          payload: gallery(false)
        });
        dispatch({
          type: types.LOADING_LISTING_DETAIL,
          loading: false
        });
      }
      // dispatch({
      //   type: types.LISTING_DETAIL_PHOTOS_REQUEST_TIMEOUT,
      //   isTimeout: false
      // });
    })
    .catch(err => {
      // dispatch({
      //   type: types.LISTING_DETAIL_PHOTOS_REQUEST_TIMEOUT,
      //   isTimeout: true
      // });
      console.log(err.message);
    });
};

export const resetListingDetail = () => dispatch => {
  dispatch({
    type: types.RESET_LISTING_DETAIL
  });
};

/**
 * GET LISTING DETAIL VIDEOS
 * @param {*} id listing
 * @param {*} key = videos
 * @param {*} max (maximumItemsOnHome)
 */
export const getListingVideos = (id, key, max) => dispatch => {
  dispatch({
    type: types.LOADING_LISTING_DETAIL,
    loading: true
  });
  dispatch({
    type: types.LISTING_DETAIL_VID_REQUEST_TIMEOUT,
    isTimeout: false
  });
  return axios
    .get(`listing-meta/${id}/${key}`, {
      params: {
        maximumItemsOnHome: max !== "" ? max : null
      }
    })
    .then(res => {
      const videos = res.data.status === "success" ? res.data.oResults : [];
      if (max !== null) {
        dispatch({
          type: types.GET_LISTING_VIDEOS,
          payload: filterMax(videos)(1)
        });
      } else {
        dispatch({
          type: types.GET_LISTING_VIDEOS_ALL,
          payload: filterMax(videos)(12)
        });
        dispatch({
          type: types.LOADING_LISTING_DETAIL,
          loading: false
        });
      }
      // dispatch({
      //   type: types.LISTING_DETAIL_VID_REQUEST_TIMEOUT,
      //   isTimeout: false
      // });
    })
    .catch(err => {
      // dispatch({
      //   type: types.LISTING_DETAIL_VID_REQUEST_TIMEOUT,
      //   isTimeout: true
      // });
      console.log(err.message);
    });
};

/**
 * GET LISTING DETAIL REVIEWS
 * @param {*} id listing
 * @param {*} key = reviews
 * @param {*} max (maximumItemsOnHome)
 */
export const getListingReviews = (id, key, max) => dispatch => {
  dispatch({
    type: types.LOADING_LISTING_DETAIL,
    loading: true
  });
  dispatch({
    type: types.LOADING_REVIEW,
    loading: true
  });
  dispatch({
    type: types.LISTING_DETAIL_REVIEWS_REQUEST_TIMEOUT,
    isTimeout: false
  });
  return axios
    .get(`listing-meta/${id}/${key}`, {
      params: {
        maximumItemsOnHome: max !== "" ? max : null
      }
    })
    .then(res => {
      const payload = res.data.status === "success" ? res.data.oResults : [];
      if (max !== null) {
        dispatch({
          type: types.GET_LISTING_REVIEWS,
          payload
        });
        dispatch({
          type: types.LOADING_REVIEW,
          loading: false
        });
      } else {
        dispatch({
          type: types.GET_LISTING_REVIEWS_ALL,
          payload
        });
        dispatch({
          type: types.LOADING_LISTING_DETAIL,
          loading: false
        });
        dispatch({
          type: types.LOADING_REVIEW,
          loading: false
        });
      }
      // dispatch({
      //   type: types.LISTING_DETAIL_REVIEWS_REQUEST_TIMEOUT,
      //   isTimeout: false
      // });
    })
    .catch(err => {
      // dispatch({
      //   type: types.LISTING_DETAIL_REVIEWS_REQUEST_TIMEOUT,
      //   isTimeout: true
      // });
      console.log(err.message);
    });
};

/**
 * GET COMMENT LISTING REVIEWS
 * @param {*} commentId by listing reviews
 */
export const getCommentInReviews = commentId => dispatch => {
  return axios
    .get(`review-discussion/${commentId}`)
    .then(res => {
      dispatch({
        type: types.GET_COMMENT_IN_REVIEWS,
        payload:
          res.data.data.status === "success"
            ? res.data.data.oResults.aDiscussion
            : []
      });
    })
    .catch(err => console.log(err.message));
};

/**
 * GET LISTING DETAIL EVENTS
 * @param {*} id listing
 * @param {*} key = events
 * @param {*} max (maximumItemsOnHome)
 */
export const getListingEvents = (id, key, max) => dispatch => {
  dispatch({
    type: types.LOADING_LISTING_DETAIL,
    loading: true
  });
  // dispatch({
  //   type: types.LISTING_DETAIL_EVENT_REQUEST_TIMEOUT,
  //   isTimeout: false
  // });
  return axios
    .get(`listing-meta/${id}/${key}`, {
      params: {
        maximumItemsOnHome: max !== "" ? max : null
      }
    })
    .then(res => {
      const payload = res.data.status === "success" ? res.data.oResults : [];
      if (max !== null) {
        dispatch({
          type: types.GET_LISTING_EVENTS,
          payload: filterMax(payload)(2)
        });
      } else {
        dispatch({
          type: types.GET_LISTING_EVENTS_ALL,
          payload
        });
        dispatch({
          type: types.LOADING_LISTING_DETAIL,
          loading: false
        });
      }
      // dispatch({
      //   type: types.LISTING_DETAIL_EVENT_REQUEST_TIMEOUT,
      //   isTimeout: false
      // });
    })
    .catch(err => {
      // dispatch({
      //   type: types.LISTING_DETAIL_EVENT_REQUEST_TIMEOUT,
      //   isTimeout: true
      // });
      console.log(err.message);
    });
};

/**
 * GET_LISTING_BOX_CUSTOM
 * @param {*} id listing
 * @param {*} key = events
 * @param {*} max (maximumItemsOnHome)
 */
export const getListingBoxCustom = (id, key, max) => dispatch => {
  dispatch({
    type: types.LOADING_LISTING_DETAIL,
    loading: true
  });
  return axios
    .get(`listing-meta/${id}/${key}`, {
      params: {
        maximumItemsOnHome: max !== "" ? max : null
      }
    })
    .then(res => {
      const data = res.data.status === "success" ? res.data.oResults : [];
      if (max !== null) {
        dispatch({
          type: types.GET_LISTING_BOX_CUSTOM,
          payload: {
            data,
            key
          }
        });
      } else {
        dispatch({
          type: types.GET_LISTING_BOX_CUSTOM_ALL,
          payload: {
            data,
            key
          }
        });
        dispatch({
          type: types.LOADING_LISTING_DETAIL,
          loading: false
        });
      }
    })
    .catch(err => {
      console.log(err.message);
    });
};

/**
 * GET LISTING DETAIL NAVIGATION
 * @param {*} data = oNavigation
 */
export const getListingDetailNavigation = data => dispatch => {
  dispatch({
    type: types.GET_LISTING_DETAIL_NAV,
    detailNav: data
  });
};

/**
 * CHANGE LISTING DETAIL NAVIGATION
 * @param {*} key
 */
export const changeListingDetailNavigation = key => dispatch => {
  dispatch({
    type: types.CHANGE_LISTING_DETAIL_NAV,
    key
  });
};

export const getListingSidebar = listingId => dispatch => {
  dispatch({
    type: types.LISTING_DETAIL_SIDEBAR_REQUEST_TIMEOUT,
    isTimeout: false
  });
  return axios
    .get(`listing/sidebar/${listingId}`)
    .then(res => {
      dispatch({
        type: types.GET_LISTING_SIDEBAR,
        payload: res.data.status === "success" ? res.data.oResults : []
      });
      // dispatch({
      //   type: types.LISTING_DETAIL_SIDEBAR_REQUEST_TIMEOUT,
      //   isTimeout: false
      // });
    })
    .catch(err => {
      // dispatch({
      //   type: types.LISTING_DETAIL_SIDEBAR_REQUEST_TIMEOUT,
      //   isTimeout: true
      // });
      console.log(err.message);
    });
};

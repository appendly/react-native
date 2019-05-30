import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { View, TouchableOpacity, Text } from "react-native";
import { connect } from "react-redux";
import he from "he";
import _ from "lodash";
import { getListingReviews } from "../../actions";
import stylesBase from "../../stylesBase";
import {
  NewGallery,
  ViewWithLoading,
  isEmpty,
  RequestTimeoutWrapped
} from "../../wiloke-elements";
import { CommentReview } from "../dumbs";
import * as Consts from "../../constants/styleConstants";

class ListingReviewsContainer extends Component {
  static propTypes = {
    params: PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      key: PropTypes.string
    }),
    type: PropTypes.string,
    colorPrimary: PropTypes.string
  };

  static defaultProps = {
    data: "",
    colorPrimary: Consts.colorPrimary
  };

  state = {
    imageIndex: 0,
    isImageViewVisible: false,
    isLoading: true
  };

  _getListingReviews = async () => {
    const { params, type, getListingReviews } = this.props;
    const { id, item, max } = params;
    type === null && (await getListingReviews(id, item.key, max));
    this.setState({ isLoading: false });
  };

  componentDidMount() {
    this._getListingReviews();
  }

  _handleCommentScreen = (_item, mode, autoFocus) => () => {
    const { navigation } = this.props;
    const { params } = this.props;
    const { id, item } = params;
    console.log(id, item.key, _item, autoFocus, mode);
    navigation.navigate("CommentListingScreen", {
      id,
      key: item.key,
      item: _item,
      autoFocus,
      mode
    });
  };

  renderReviewGallery = item => {
    const { settings } = this.props;
    const thumbnails = item.oGallery.medium.filter(item => item);
    const modalSlider = item.oGallery.large.filter(item => item);
    return (
      <View style={{ paddingTop: 8 }}>
        {!isEmpty(thumbnails) && (
          <NewGallery
            thumbnails={thumbnails}
            modalSlider={modalSlider}
            thumbnailMax={3}
            colorPrimary={settings.colorPrimary}
          />
        )}
      </View>
    );
  };

  renderItemReview = mode => (item, index) => {
    const { translations } = this.props;
    return (
      <CommentReview
        key={index.toString()}
        colorPrimary={this.props.settings.colorPrimary}
        headerActionSheet={{
          options: [
            "Cancel",
            "Remove",
            "Report review",
            "Comment",
            "Pin to Top of Review",
            "Write a review",
            "Edit review"
          ],
          title: he.decode(item.postTitle),
          message: he.decode(`${item.postContent.substr(0, 40)}...`),
          destructiveButtonIndex: 1,
          cancelButtonIndex: 0,
          onPressButtonItem: () => {
            console.log("press");
          },
          onAction: buttonIndex => {
            console.log(buttonIndex);
            if (buttonIndex === 1) {
              // code
            }
          }
        }}
        rated={item.oReviews.average}
        ratedMax={mode}
        ratedText={item.oReviews.quality ? item.oReviews.quality : ""}
        headerAuthor={{
          image: item.oUserInfo.avatar,
          title: he.decode(item.oUserInfo.displayName),
          text: item.postDate
        }}
        renderContent={() => (
          <View>
            <Text style={[stylesBase.h5, { marginBottom: 3 }]}>
              {he.decode(item.postTitle)}
            </Text>
            <Text style={stylesBase.text}>
              {he.decode(`${item.postContent.substr(0, 200)}...`)}
            </Text>
            {item.postContent.length > 200 && (
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={this._handleCommentScreen(item, mode, false)}
                style={{ marginTop: 4 }}
              >
                <Text style={[stylesBase.text, { color: Consts.colorDark4 }]}>
                  {translations.seeMoreReview}
                </Text>
              </TouchableOpacity>
            )}
            {item.oGallery &&
              !_.isEmpty(item.oGallery) &&
              this.renderReviewGallery(item)}
            <View style={{ height: 3 }} />
          </View>
        )}
        shares={{
          count: item.countShared,
          text: item.countShared > 1 ? translations.shares : translations.share
        }}
        comments={{
          count: item.countDiscussions,
          isLoading: false,
          text:
            item.countDiscussions > 1
              ? translations.comments
              : translations.comment
        }}
        likes={{
          count: item.countLiked,
          text: item.countLiked > 1 ? translations.likes : translations.like
        }}
        onComment={this._handleCommentScreen(item, mode, true)}
        style={{ marginBottom: 10 }}
      />
    );
  };

  renderContent = (data, mode, isLoading) => {
    const { isListingDetailReviewsRequestTimeout, translations } = this.props;
    return (
      <RequestTimeoutWrapped
        isTimeout={isListingDetailReviewsRequestTimeout}
        onPress={this._getListingReviews}
        text={translations.networkError}
        buttonText={translations.retry}
      >
        <ViewWithLoading
          isLoading={isLoading}
          contentLoader="contentHeaderAvatar"
          contentLoaderItemLength={3}
        >
          {!isEmpty(data) && data.map(this.renderItemReview(mode))}
        </ViewWithLoading>
      </RequestTimeoutWrapped>
    );
  };

  renderTotalReviews = total => {
    const { navigation } = this.props;
    const { name } = navigation.state.params;
    return (
      total &&
      total !== "undefined" && (
        <View
          style={{
            padding: 10,
            backgroundColor: "#fff",
            marginBottom: 10,
            borderWidth: 1,
            borderColor: Consts.colorGray1
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <Text style={[stylesBase.text, { color: this.props.colorPrimary }]}>
              {total}
            </Text>
            <Text style={stylesBase.text}> Review For {name}</Text>
          </View>
        </View>
      )
    );
  };

  render() {
    const {
      listingReviews,
      listingReviewsAll,
      loadingListingDetail,
      type
    } = this.props;
    const { isLoading } = this.state;
    return (
      <View>
        {type === "all" ? (
          this.renderContent(
            listingReviewsAll.aReviews,
            listingReviewsAll.mode,
            loadingListingDetail
          )
        ) : (
          <Fragment>
            {this.renderTotalReviews(listingReviews.total)}
            {this.renderContent(
              listingReviews.aReviews,
              listingReviews.mode,
              isLoading
            )}
          </Fragment>
        )}
      </View>
    );
  }
}

const mapStateToProps = state => ({
  listingReviews: state.listingReviews,
  listingReviewsAll: state.listingReviewsAll,
  translations: state.translations,
  loadingListingDetail: state.loadingListingDetail,
  isListingDetailReviewsRequestTimeout:
    state.isListingDetailReviewsRequestTimeout,
  settings: state.settings
});

export default connect(
  mapStateToProps,
  { getListingReviews }
)(ListingReviewsContainer);

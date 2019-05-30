import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import {
  Text,
  View,
  StatusBar,
  Keyboard,
  TouchableWithoutFeedback
} from "react-native";
import he from "he";
import { NewGallery } from "../../wiloke-elements";
import { CommentReview } from "../dumbs";
import stylesBase from "../../stylesBase";
import { connect } from "react-redux";
import { getCommentInReviews } from "../../actions";

const TIME_FAKE = 4000;

class CommentListingScreen extends PureComponent {
  state = {
    isLoading: true
  };
  async componentDidMount() {
    const { navigation, getCommentInReviews } = this.props;
    const { params } = navigation.state;
    const { item } = params;
    const commentId = item.ID;
    await getCommentInReviews(commentId);
    this.setState({ isLoading: false });
    // RealTime Faker
    // this._realTimeFaker = setInterval(() => {
    //   getCommentInReviews(commentId);
    // }, TIME_FAKE);
  }

  // componentWillUnmount() {
  //   clearInterval(this._realTimeFaker);
  // }

  _handleGoBack = () => {
    const { navigation } = this.props;
    Keyboard.dismiss();
    navigation.goBack();
  };

  renderReviewGallery = item => {
    const { settings } = this.props;
    return (
      item.oGallery !== false && (
        <View style={{ paddingTop: 8 }}>
          <NewGallery
            thumbnails={item.oGallery.medium}
            modalSlider={item.oGallery.large}
            colorPrimary={settings.colorPrimary}
          />
        </View>
      )
    );
  };

  render() {
    // console.log(this.props.navigation);
    const { navigation, translations, commentInReviews } = this.props;
    const { params } = navigation.state;
    const { id, key, item, autoFocus, mode } = params;
    const { isLoading } = this.state;
    const dataComments =
      commentInReviews.length > 0
        ? commentInReviews.map((item, index) => ({
            id: index.toString() + item.postContent,
            image: item.oUserInfo.avatar,
            title: item.oUserInfo.displayName,
            message: item.postContent,
            text: item.postDate
          }))
        : [];
    return (
      <View>
        {/* <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}> */}
        <View>
          <StatusBar barStyle="dark-content" />
          <CommentReview
            fullScreen={true}
            colorPrimary={this.props.settings.colorPrimary}
            inputAutoFocus={autoFocus ? true : false}
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
                  {he.decode(item.postContent)}
                </Text>
                {this.renderReviewGallery(item)}
                <View style={{ height: 3 }} />
              </View>
            )}
            shares={{
              count: item.countShared,
              text:
                item.countShared > 1 ? translations.shares : translations.share
            }}
            comments={{
              data: dataComments.reverse(),
              count: item.countDiscussions,
              isLoading,
              text:
                item.countDiscussions > 1
                  ? translations.comments
                  : translations.comment
            }}
            likes={{
              count: item.countLiked,
              text: item.countLiked > 1 ? translations.likes : translations.like
            }}
            commentsActionSheet={{
              options: ["Cancel", "Remove", "Edit", "Report"],
              title: "Comment by Russell Reyes",
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
            goBack={this._handleGoBack}
            style={{ borderWidth: 0 }}
          />
        </View>
        {/* </TouchableWithoutFeedback> */}
      </View>
    );
  }
}

const mapStateToProps = state => ({
  translations: state.translations,
  commentInReviews: state.commentInReviews,
  settings: state.settings
});

export default connect(
  mapStateToProps,
  { getCommentInReviews }
)(CommentListingScreen);

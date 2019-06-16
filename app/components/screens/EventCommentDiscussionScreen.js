import React, { Component } from "react";
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
import { getCommentInDiscussionEvent } from "../../actions";

const TIME_FAKE = 4000;

class EventCommentDiscussionScreen extends Component {
  state = {
    loading: true
  };
  async componentDidMount() {
    const { navigation, getCommentInDiscussionEvent } = this.props;
    const { params } = navigation.state;
    const { item } = params;
    const discussionId = item.ID;
    await getCommentInDiscussionEvent(discussionId);
    this.setState({ isLoading: false });
    // RealTime Faker
    this._realTimeFaker = setInterval(() => {
      getCommentInDiscussionEvent(discussionId);
    }, TIME_FAKE);
  }

  componentWillUnmount() {
    clearInterval(this._realTimeFaker);
  }

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
    const { navigation, translations, commentInDiscussionEvent } = this.props;
    const { params } = navigation.state;
    const { item, autoFocus } = params;
    const { isLoading } = this.state;
    const dataComments =
      commentInDiscussionEvent.oResults &&
      commentInDiscussionEvent.oResults.length > 0
        ? commentInDiscussionEvent.oResults.map((item, index) => ({
            id: index.toString(),
            image: item.oAuthor.avatar,
            title: item.oAuthor.displayName,
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
            headerAuthor={{
              image: item.oAuthor.avatar,
              title: he.decode(item.oAuthor.displayName),
              text: item.postDate
            }}
            renderContent={() => (
              <View>
                <Text style={stylesBase.text}>
                  {he.decode(item.postContent)}
                </Text>
              </View>
            )}
            shares={{
              count: item.countShared,
              text:
                item.countShared > 1 ? translations.shares : translations.share
            }}
            comments={{
              data: dataComments,
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
  commentInDiscussionEvent: state.commentInDiscussionEvent,
  settings: state.settings
});

export default connect(
  mapStateToProps,
  { getCommentInDiscussionEvent }
)(EventCommentDiscussionScreen);

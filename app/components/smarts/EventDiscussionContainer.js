import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Text, View, TouchableOpacity, FlatList, Platform } from "react-native";
import { connect } from "react-redux";
import { getEventDiscussion, getEventDiscussionLoadmore } from "../../actions";
import { CommentReview } from "../dumbs";
import * as Consts from "../../constants/styleConstants";
import stylesBase from "../../stylesBase";
import he from "he";
import { Button, ViewWithLoading, Loader } from "../../wiloke-elements";

const END_REACHED_THRESHOLD = Platform.OS === "ios" ? 0 : 1;

class EventDiscussionContainer extends PureComponent {
  static defaultProps = {
    colorPrimary: Consts.colorPrimary
  };

  static propTypes = {
    colorPrimary: PropTypes.string
  };

  state = {
    isLoading: true
  };

  _getEventDiscussion = async () => {
    try {
      const { getEventDiscussion, id, type } = this.props;
      await getEventDiscussion(id, type);
      this.setState({ isLoading: false });
    } catch (err) {
      console.log(err);
    }
  };

  componentDidMount() {
    this._getEventDiscussion();
  }

  _handleEndReached = next => {
    this.props.getEventDiscussionLoadmore(next);
  };

  _handleCommentScreen = (item, autoFocus) => () => {
    const { navigation } = this.props;
    navigation.navigate("EventCommentDiscussionScreen", {
      item,
      autoFocus
    });
  };

  renderItem = ({ item, index }) => {
    const { translations } = this.props;
    return (
      <CommentReview
        key={index.toString()}
        colorPrimary={this.props.settings.colorPrimary}
        // headerActionSheet={{
        //   options: [
        //     "Cancel",
        //     "Remove",
        //     "Report review",
        //     "Comment",
        //     "Pin to Top of Review",
        //     "Write a review",
        //     "Edit review"
        //   ],
        //   title: he.decode(item.postTitle),
        //   message: he.decode(`${item.postContent.substr(0, 40)}...`),
        //   destructiveButtonIndex: 1,
        //   cancelButtonIndex: 0,
        //   onPressButtonItem: () => {
        //     console.log("press");
        //   },
        //   onAction: buttonIndex => {
        //     console.log(buttonIndex);
        //     if (buttonIndex === 1) {
        //       // code
        //     }
        //   }
        // }}
        headerAuthor={{
          image: item.oAuthor.avatar,
          title: he.decode(item.oAuthor.displayName),
          text: item.postDate
        }}
        renderContent={() => (
          <View>
            <Text style={stylesBase.text}>
              {he.decode(
                item.postContent.length > 200
                  ? `${item.postContent.substr(0, 200)}...`
                  : item.postContent
              )}
            </Text>
            {item.postContent.length > 200 && (
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={this._handleCommentScreen(item, false)}
                style={{ marginTop: 4 }}
              >
                <Text style={[stylesBase.text, { color: Consts.colorDark4 }]}>
                  {translations.seeMoreReview}
                </Text>
              </TouchableOpacity>
            )}
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
        onComment={this._handleCommentScreen(item, true)}
        style={{ marginBottom: 10 }}
      />
    );
  };

  render() {
    const {
      eventDiscussion,
      eventDiscussionLatest,
      type,
      id,
      translations,
      navigation
    } = this.props;
    const _eventDiscussion =
      type === "latest" ? eventDiscussionLatest : eventDiscussion;
    const data = _eventDiscussion.oResults;
    const { isLoading } = this.state;
    return (
      <View>
        <ViewWithLoading
          isLoading={isLoading}
          contentLoader="contentHeaderAvatar"
          contentLoaderItemLength={3}
        >
          {data && data.length > 0 && type === "latest" && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 10,
                marginTop: 10
              }}
            >
              <Text
                style={{
                  color: this.props.settings.colorPrimary,
                  fontSize: 24,
                  fontWeight: "500"
                }}
              >
                {_eventDiscussion.countDiscussions}
              </Text>
              <Text
                style={{
                  color: Consts.colorDark2,
                  fontSize: 18,
                  fontWeight: "500"
                }}
              >
                {` ${
                  _eventDiscussion.countDiscussions === 1
                    ? translations.discussion
                    : translations.discussions
                }`}
              </Text>
            </View>
          )}
          {data && data.length > 0 && (
            <FlatList
              data={data}
              renderItem={this.renderItem}
              keyExtractor={item => item.ID.toString()}
              showsVerticalScrollIndicator={false}
              onEndReachedThreshold={END_REACHED_THRESHOLD}
              onEndReached={() =>
                _eventDiscussion &&
                _eventDiscussion.next !== false &&
                type !== "latest"
                  ? this._handleEndReached(_eventDiscussion.next)
                  : {}
              }
              ListFooterComponent={() =>
                _eventDiscussion &&
                _eventDiscussion.next !== false &&
                type !== "latest" && <Loader size={30} height={80} />
              }
            />
          )}

          {data && data.length > 2 && type === "latest" && (
            <View style={{ marginBottom: 20 }}>
              <Button
                size="lg"
                block={true}
                backgroundColor="light"
                color="dark"
                onPress={() => {
                  navigation.navigate("EventDiscussionAllScreen", {
                    id
                  });
                }}
              >
                {translations.seeMoreDiscussions}
              </Button>
            </View>
          )}
        </ViewWithLoading>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  eventDiscussion: state.eventDiscussion,
  eventDiscussionLatest: state.eventDiscussionLatest,
  translations: state.translations,
  settings: state.settings
});

export default connect(
  mapStateToProps,
  {
    getEventDiscussion,
    getEventDiscussionLoadmore
  }
)(EventDiscussionContainer);

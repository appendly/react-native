import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ViewPropTypes,
  Platform
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { Constants } from "expo";
import {
  ImageCircleAndText,
  ActionSheet,
  IconTextSmall,
  InputAccessoryLayoutFullScreen,
  WithLoading
} from "../../wiloke-elements";
import * as Consts from "../../constants/styleConstants";
import stylesBase from "../../stylesBase";
import Rated from "./Rated";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export default class CommentReview extends Component {
  static propTypes = {
    headerActionSheet: PropTypes.object,
    renderContent: PropTypes.func,
    onLike: PropTypes.func,
    onComment: PropTypes.func,
    onShare: PropTypes.func,
    goBack: PropTypes.func,
    comments: PropTypes.shape({
      data: PropTypes.array,
      count: PropTypes.number
    }),
    likes: PropTypes.shape({
      count: PropTypes.number
    }),
    shares: PropTypes.shape({
      count: PropTypes.number
    }),
    style: ViewPropTypes.style,
    fullScreen: PropTypes.bool,
    rated: PropTypes.number,
    ratedMax: PropTypes.number,
    ratedText: PropTypes.string,
    inputAutoFocus: PropTypes.bool,
    colorPrimary: PropTypes.string
  };

  static defaultProps = {
    renderContent: () => {},
    onLike: () => {},
    onComment: () => {},
    onShare: () => {},
    goBack: () => {},
    fullScreen: false,
    inputAutoFocus: true,
    colorPrimary: Consts.colorPrimary
  };

  state = {
    keyboardAvoidingViewEnabled: false
  };

  componentDidMount() {
    this.setState({ keyboardAvoidingViewEnabled: true });
  }

  renderActionSheet() {
    return (
      <ActionSheet
        {...this.props.headerActionSheet}
        renderButtonItem={() => (
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 15,
              justifyContent: "center",
              alignItems: "center",
              marginLeft: 10
            }}
          >
            <Feather
              name="more-horizontal"
              size={20}
              color={Consts.colorDark3}
            />
          </View>
        )}
      />
    );
  }

  renderHeader() {
    const { onPressMoreHorizontal, fullScreen, goBack } = this.props;
    return (
      <View style={styles.header}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {fullScreen && (
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={goBack}
              style={{ marginRight: 10 }}
            >
              <Feather
                name="chevron-left"
                size={30}
                color={Consts.colorDark2}
              />
            </TouchableOpacity>
          )}
          <ImageCircleAndText {...this.props.headerAuthor} horizontal={true} />
        </View>
        <View style={styles.headerRight}>
          {this.props.rated && (
            <Rated
              rate={this.props.rated}
              max={this.props.ratedMax}
              text={this.props.ratedText}
            />
          )}
          {this.renderActionSheet()}
        </View>
      </View>
    );
  }

  renderContent() {
    const { renderContent } = this.props;
    return <View style={styles.content}>{renderContent()}</View>;
  }

  renderActionGroup() {
    const { onLike, onComment, onShare } = this.props;
    const propsGeneral = {
      iconColor: Consts.colorDark3,
      iconSize: 16,
      textSize: 12,
      textColor: Consts.colorDark3
    };
    return (
      <View style={styles.actionGroup}>
        <TouchableOpacity
          activeOpacity={0.6}
          style={styles.icon}
          onPress={onLike}
        >
          <IconTextSmall
            {...propsGeneral}
            text="Like"
            iconName="thumbs-up"
            iconColor={this.props.colorPrimary}
          />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.6}
          style={styles.icon}
          onPress={onComment}
        >
          <IconTextSmall
            {...propsGeneral}
            text="Comment"
            iconName="message-square"
            iconColor={this.props.colorPrimary}
          />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.6}
          style={styles.icon}
          onPress={onShare}
        >
          <IconTextSmall
            {...propsGeneral}
            text="Share"
            iconName="share"
            iconColor={this.props.colorPrimary}
          />
        </TouchableOpacity>
      </View>
    );
  }

  renderItemComments = ({ item, index }) => {
    return (
      <ActionSheet
        {...this.props.commentsActionSheet}
        key={item.id.toString()}
        renderButtonItem={() => (
          <View
            style={{
              borderTopWidth: index === 0 ? 0 : 1,
              borderTopColor: Consts.colorGray1,
              paddingHorizontal: 10,
              paddingVertical: 15
            }}
          >
            <ImageCircleAndText
              image={item.image}
              title={item.title}
              text={item.text}
              message={item.message}
              horizontal={true}
              imageSize={40}
              style={{
                alignItems: "flex-start"
              }}
            />
          </View>
        )}
      />
    );
  };

  renderComments() {
    const { comments } = this.props;
    const { isLoading } = comments;
    const ViewWithLoading = WithLoading(View);
    return (
      <ViewWithLoading isLoading={isLoading && isLoading}>
        {comments.data &&
          comments.data.map((item, index) =>
            this.renderItemComments({ item, index })
          )}
      </ViewWithLoading>
    );
  }

  renderMeta() {
    const { likes, comments, shares } = this.props;
    return (
      <View style={styles.meta}>
        <Text style={styles.metaItem}>
          {likes.count} {likes.text}
        </Text>
        <Text style={styles.metaItem}>
          {comments.count} {comments.text}
        </Text>
        <Text style={styles.metaItem}>
          {shares.count} {shares.text}
        </Text>
      </View>
    );
  }

  render() {
    const { keyboardAvoidingViewEnabled } = this.state;
    const { comments } = this.props;
    return (
      <Fragment>
        {!this.props.fullScreen ? (
          <View
            style={[
              styles.container,
              {
                borderWidth: comments.data && comments.data.length > 0 ? 1 : 0
              },
              this.props.style
            ]}
          >
            {this.renderHeader()}
            {this.renderContent()}
            {this.renderMeta()}
            {this.renderActionGroup()}
            {this.renderComments()}
          </View>
        ) : (
          <InputAccessoryLayoutFullScreen
            renderHeader={() => (
              <View>
                <View
                  style={{
                    height: Constants.statusBarHeight,
                    backgroundColor: "#fff"
                  }}
                />
                {this.renderHeader()}
              </View>
            )}
            renderContent={() => (
              <View style={{ backgroundColor: "#fff" }}>
                {this.renderContent()}
                {this.renderMeta()}
                {this.renderActionGroup()}
                {this.renderComments()}
              </View>
            )}
            textInputEnabled={false}
          />
        )}
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderColor: Consts.colorGray1
  },
  header: {
    position: "relative",
    zIndex: 9,
    borderBottomWidth: 1,
    borderBottomColor: Consts.colorGray1,
    paddingHorizontal: 10,
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff"
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center"
  },
  content: {
    padding: 10
  },
  actionGroup: {
    borderTopWidth: 1,
    borderTopColor: Consts.colorGray1,
    borderBottomWidth: 1,
    borderBottomColor: Consts.colorGray1,
    paddingHorizontal: 10,
    flexDirection: "row"
  },
  icon: {
    marginRight: 25,
    paddingVertical: 10
  },
  meta: {
    paddingHorizontal: 10,
    paddingTop: 3,
    paddingBottom: 13,
    flexDirection: "row"
  },
  metaItem: {
    color: Consts.colorDark3,
    fontSize: 11,
    marginRight: 10
  }
});

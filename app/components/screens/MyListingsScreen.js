import React, { Component } from "react";
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Alert,
  StyleSheet
} from "react-native";
import { Layout, ListingSmallCard, Rated } from "../dumbs";
import {
  ViewWithLoading,
  ModalPicker,
  isCloseToBottom,
  MessageError
} from "../../wiloke-elements";
import { connect } from "react-redux";
import {
  getMyListings,
  getMyListingsLoadmore,
  getListingStatus,
  getPostTypes
} from "../../actions";
import { Feather } from "@expo/vector-icons";
import _ from "lodash";
import he from "he";
import Swipeout from "react-native-swipeout";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const ICON_WIDTH = 30;
const ICON_HEIGHT = 30;

class MyListingsScreen extends Component {
  state = {
    isLoading: true,
    isScrollEnabled: true,
    postType: "all",
    postStatus: "all",
    isFetch: false,
    startLoadmore: false
  };

  _getMyListings = async ({ postType, postStatus }) => {
    const { getMyListings } = this.props;
    await getMyListings({ postType, postStatus });
  };

  async componentDidMount() {
    const { getListingStatus, getPostTypes, translations } = this.props;
    await this.setState({ isLoading: true });
    await Promise.all([
      getListingStatus(translations.status),
      getPostTypes(translations.postType)
    ]);
    await this._getMyListings({
      postType: "all",
      postStatus: "all"
    });
    this.setState({ isLoading: false, startLoadmore: true });
  }

  componentDidUpdate(prevProps) {
    if (!_.isEqual(prevProps.myListings, this.props.myListings)) {
      this.setState({
        isFetch: true
      });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (!_.isEqual(nextProps.myListings, this.props.myListings)) {
      return true;
    }
    if (!_.isEqual(nextState.isLoading, this.state.isLoading)) {
      return true;
    }
    return false;
  }

  _handlePressItem = item => _ => {
    const { navigation } = this.props;
    navigation.navigate("ListingDetailScreen", {
      id: item.ID,
      name: he.decode(item.postTitle),
      tagline: !!item.tagLine ? he.decode(item.tagLine) : null,
      link: item.postLink,
      author: item.oAuthor,
      image:
        SCREEN_WIDTH > 420 ? item.oFeaturedImg.large : item.oFeaturedImg.medium,
      logo: item.logo ? item.logo : item.oFeaturedImg.thumbnail
    });
  };

  renderItem = (item, index) => {
    return (
      <TouchableOpacity
        key={index.toString()}
        activeOpacity={0.6}
        onPress={this._handlePressItem(item)}
      >
        <ListingSmallCard
          image={item.oFeaturedImg.thumbnail}
          image={
            SCREEN_WIDTH > 420
              ? item.oFeaturedImg.large
              : item.oFeaturedImg.medium
          }
          title={item.postTitle}
          text={item.tagLine}
          renderRate={() => {
            return (
              item.oReview && (
                <Rated
                  rate={item.oReview.average}
                  max={item.oReview.mode}
                  rateStyle={{ fontSize: 13, marginRight: 2 }}
                  maxStyle={{ fontSize: 9 }}
                  style={{ marginVertical: 5 }}
                />
              )
            );
          }}
        />
      </TouchableOpacity>
    );
  };

  renderContent = () => {
    const { myListings, myListingError, translations } = this.props;
    const { oResults, next } = myListings;
    const { isLoading } = this.state;
    return (
      <View>
        <ViewWithLoading
          isLoading={isLoading}
          contentLoader="headerAvatar"
          avatarSquare={true}
          avatarSize={60}
          contentLoaderItemLength={8}
          gap={0}
        >
          {!_.isEmpty(oResults) && oResults.map(this.renderItem)}
        </ViewWithLoading>
        {next && (
          <ViewWithLoading
            isLoading={true}
            contentLoader="headerAvatar"
            avatarSquare={true}
            avatarSize={60}
            contentLoaderItemLength={1}
            gap={0}
          />
        )}
        {_.isEmpty(myListings.oResults) && !!myListingError && (
          <MessageError message={translations[myListingError]} />
        )}
        <View style={{ height: 30 }} />
      </View>
    );
  };

  _renderHeaderCenter = (options, onChangeOptions, modify) => {
    const { settings } = this.props;
    return (
      <View style={styles.headerCenterWrapper}>
        {options.length > 0 ? (
          <ModalPicker
            options={options}
            onChangeOptions={onChangeOptions}
            underlayBorder={false}
            textResultStyle={{
              color: "#fff",
              fontSize: 12,
              marginRight: 4,
              width: 84
            }}
            textResultNumberOfLines={1}
            iconResultColor="#fff"
            clearSelectEnabled={false}
            colorPrimary={settings.colorPrimary}
          />
        ) : (
          <View style={{ height: 46, width: 84, justifyContent: "center" }}>
            <Text style={{ color: "#fff" }}>...</Text>
          </View>
        )}
        {modify === "postStatus" && <View style={styles.lineVertical} />}
        <View
          style={[
            styles.headerCenterBorder,
            {
              borderTopRightRadius: modify === "postType" ? 0 : 5,
              borderBottomRightRadius: modify === "postType" ? 0 : 5,
              borderTopLeftRadius: modify === "postStatus" ? 0 : 5,
              borderBottomLeftRadius: modify === "postStatus" ? 0 : 5,
              borderRightWidth: modify === "postType" ? 0 : 1,
              borderLeftWidth: modify === "postStatus" ? 0 : 1
            }
          ]}
        />
      </View>
    );
  };

  _handleChangeOptions = modify => async (options, selected) => {
    await this.setState({ isLoading: true });
    await this.setState({
      postType: modify === "postType" ? selected[0].id : this.state.postType,
      postStatus:
        modify === "postStatus" ? selected[0].id : this.state.postStatus
    });
    await this._getMyListings({
      postType: this.state.postType,
      postStatus: this.state.postStatus
    });
    this.setState({ isLoading: false, startLoadmore: true });
  };

  _handleLoadmore = async _ => {
    const { myListings } = this.props;
    const { next } = myListings;
    const { startLoadmore } = this.state;
    this.setState({
      isFetch: false
    });
    !!next &&
      startLoadmore &&
      this.state.isFetch &&
      (await this.props.getMyListingsLoadmore({
        next,
        postType: this.state.postType,
        postStatus: this.state.postStatus
      }));
    this.setState({
      isFetch: true
    });
  };

  render() {
    const {
      navigation,
      settings,
      translations,
      auth,
      postTypes,
      listingStatus
    } = this.props;
    const { isLoggedIn } = auth;
    return (
      <Layout
        navigation={navigation}
        headerType="headerHasFilter"
        renderCenter={() => (
          <View style={{ flexDirection: "row" }}>
            {this._renderHeaderCenter(
              postTypes,
              this._handleChangeOptions("postType"),
              "postType"
            )}
            {this._renderHeaderCenter(
              listingStatus,
              this._handleChangeOptions("postStatus"),
              "postStatus"
            )}
          </View>
        )}
        renderLeft={() => (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.goBack()}
          >
            <View
              style={[
                styles.icon,
                {
                  alignItems: "flex-start"
                }
              ]}
            >
              <Feather name="chevron-left" size={26} color="#fff" />
            </View>
          </TouchableOpacity>
        )}
        renderRight={() => (
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => navigation.navigate("SearchScreen")}
          >
            <Feather name="search" size={20} color="#fff" />
          </TouchableOpacity>
        )}
        renderContent={this.renderContent}
        colorPrimary={settings.colorPrimary}
        textSearch={translations.search}
        isLoggedIn={isLoggedIn}
        scrollEnabled={this.state.isScrollEnabled}
        scrollEventThrottle={16}
        onMomentumScrollEnd={({ nativeEvent }) => {
          isCloseToBottom(nativeEvent) && this._handleLoadmore();
        }}
      />
    );
  }
}

const styles = StyleSheet.create({
  headerCenterWrapper: {
    position: "relative",
    paddingLeft: 8,
    paddingRight: 5,
    zIndex: 9
  },
  headerCenterBorder: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 12,
    bottom: 12,
    borderWidth: 1,
    borderColor: "#fff",
    opacity: 0.8,
    borderRadius: 5,
    zIndex: -1
  },
  container: {
    flexDirection: "row"
  },
  lineVertical: {
    position: "absolute",
    top: 12,
    bottom: 12,
    left: 0,
    width: 1,
    backgroundColor: "#fff"
  },

  icon: {
    width: ICON_WIDTH,
    height: ICON_HEIGHT,
    justifyContent: "center",
    alignItems: "center"
  }
});

const mapStateToProps = state => ({
  myListings: state.myListings,
  settings: state.settings,
  translations: state.translations,
  auth: state.auth,
  myListingError: state.myListingError,
  postTypes: state.postTypes,
  listingStatus: state.listingStatus
});

const mapDispatchToProps = {
  getMyListings,
  getMyListingsLoadmore,
  getListingStatus,
  getPostTypes
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MyListingsScreen);

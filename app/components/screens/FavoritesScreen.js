import React, { Component } from "react";
import { Dimensions, TouchableOpacity, Alert } from "react-native";
import { Layout, ListingSmallCard, Rated } from "../dumbs";
import {
  ViewWithLoading,
  LoadingFull,
  MessageError
} from "../../wiloke-elements";
import { connect } from "react-redux";
import { getMyFavorites, addMyFavorites } from "../../actions";
import { Feather } from "@expo/vector-icons";
import _ from "lodash";
import he from "he";
import Swipeout from "react-native-swipeout";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

class FavoritesScreen extends Component {
  state = {
    isLoading: true,
    isScrollEnabled: true,
    isDeleteLoading: false
  };
  async componentDidMount() {
    const { getMyFavorites, navigation } = this.props;
    await getMyFavorites();
    this.setState({ isLoading: false });
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (!_.isEqual(nextProps.myFavorites, this.props.myFavorites)) {
      return true;
    }
    if (!_.isEqual(nextState.isLoading, this.state.isLoading)) {
      return true;
    }
    if (!_.isEqual(nextState.isScrollEnabled, this.state.isScrollEnabled)) {
      return true;
    }
    if (!_.isEqual(nextState.isDeleteLoading, this.state.isDeleteLoading)) {
      return true;
    }
    return false;
  }

  _handlePressItem = item => () => {
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

  _deleteListItem = ID => async _ => {
    const { addMyFavorites } = this.props;
    await this.setState({ isDeleteLoading: true });
    await addMyFavorites(ID);
    this.setState({ isDeleteLoading: false });
  };

  renderItem = item => {
    const { listIdPostFavoritesRemoved, translations } = this.props;
    const condition =
      listIdPostFavoritesRemoved.filter(_item => _item.id === item.ID).length >
      0;
    return (
      !condition && (
        <Swipeout
          key={item.ID.toString()}
          right={[
            {
              text: translations.delete,
              type: "delete",
              onPress: () => {
                Alert.alert(
                  `${translations.delete} ${he.decode(item.postTitle)}`,
                  translations.confirmDeleteFavorites,
                  [
                    {
                      text: translations.cancel,
                      style: "cancel"
                    },
                    {
                      text: translations.ok,
                      onPress: this._deleteListItem(item.ID)
                    }
                  ],
                  { cancelable: false }
                );
              }
            }
          ]}
          autoClose={true}
          scroll={event => this.setState({ isScrollEnabled: event })}
          style={{
            backgroundColor: "#fff"
          }}
        >
          <TouchableOpacity
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
        </Swipeout>
      )
    );
  };

  renderContent = () => {
    const { myFavorites, translations } = this.props;
    const { oResults, status, msg } = myFavorites;
    const { isLoading, isDeleteLoading } = this.state;
    return (
      <ViewWithLoading
        isLoading={isLoading}
        contentLoader="headerAvatar"
        avatarSquare={true}
        avatarSize={60}
        contentLoaderItemLength={8}
        gap={0}
      >
        {!_.isEmpty(oResults) && oResults.map(this.renderItem)}
        <LoadingFull visible={isDeleteLoading} />
        {status === "error" && <MessageError message={translations[msg]} />}
      </ViewWithLoading>
    );
  };

  render() {
    const { navigation, settings, translations, auth } = this.props;
    const { isLoggedIn } = auth;
    const { name } = navigation.state.params;
    return (
      <Layout
        navigation={navigation}
        headerType="headerHasBack"
        title={name}
        goBack={() => navigation.goBack()}
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
      />
    );
  }
}

const mapStateToProps = state => ({
  myFavorites: state.myFavorites,
  listIdPostFavoritesRemoved: state.listIdPostFavoritesRemoved,
  settings: state.settings,
  translations: state.translations,
  auth: state.auth
});

const mapDispatchToProps = {
  getMyFavorites,
  addMyFavorites
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FavoritesScreen);

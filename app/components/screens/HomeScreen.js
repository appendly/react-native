import React, { Component } from "react";
import { View, RefreshControl, FlatList, AppState } from "react-native";
import { WithLoading, RequestTimeoutWrapped } from "../../wiloke-elements";
import stylesBase from "../../stylesBase";
import {
  Heading,
  Hero,
  Layout,
  ListingLayoutHorizontal,
  ListingLayoutPopular,
  ListingLayoutCat,
  ListingCat,
  EventItem
} from "../dumbs";
import he from "he";
import { connect } from "react-redux";
import {
  getHomeScreen,
  getTabNavigator,
  getShortProfile,
  readNewMessageChat,
  getKeyFirebase
} from "../../actions";
import _ from "lodash";
import * as Consts from "../../constants/styleConstants";
import { Notifications } from "expo";

const SCREEN_WIDTH = Consts.screenWidth;

class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.refreshing = false;
    this.state = {
      appState: AppState.currentState,
      notification: null
    };
  }

  _getHomeAPIRequestTimeout = () => {
    this.props.getHomeScreen();
    this.props.getTabNavigator();
  };

  async componentDidMount() {
    const { auth } = this.props;
    if (auth.isLoggedIn) {
      await this.props.getShortProfile();
      AppState.addEventListener("change", this._handleAppStateChange);
    }
    Notifications.addListener(this._handleNotification);
  }

  componentWillUnmount() {
    const { auth } = this.props;
    if (auth.isLoggedIn) {
      AppState.addEventListener("change", this._handleAppStateChange);
    }
  }

  _handleAppStateChange = async nextAppState => {
    const {
      shortProfile,
      getKeyFirebase,
      navigation,
      readNewMessageChat
    } = this.props;
    const { notification } = this.state;
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === "active" &&
      notification
    ) {
      console.log("App has come to the foreground!");
      const myID = shortProfile.userID;
      const { screen, userID } = notification.data;
      if (screen === "SendMessageScreen") {
        await getKeyFirebase(myID, userID, "forPushNotification");
        await getKeyFirebase(myID, userID);
        const { keyFirebase2, keyFirebase } = this.props;
        readNewMessageChat(userID, keyFirebase);
        const data = {
          ...notification.data,
          key: keyFirebase2
        };
        navigation.navigate(screen, data);
      } else {
        navigation.navigate(screen, notification.data);
      }
    }
    this.setState({ appState: nextAppState });
  };

  _handleNotification = async notification => {
    this.setState({ notification });
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (!_.isEqual(nextProps.homeScreen, this.props.homeScreen)) {
      return true;
    }
    if (!_.isEqual(nextProps.translations, this.props.translations)) {
      return true;
    }
    if (!_.isEqual(nextProps.settings, this.props.settings)) {
      return true;
    }
    if (!_.isEqual(nextProps.tabNavigator, this.props.tabNavigator)) {
      return true;
    }
    if (!_.isEqual(nextProps.auth, this.props.auth)) {
      return true;
    }
    if (!_.isEqual(nextProps.shortProfile, this.props.shortProfile)) {
      return true;
    }
    if (!_.isEqual(nextProps.keyFirebase2, this.props.keyFirebase2)) {
      return true;
    }
    if (!_.isEqual(nextState.appState, this.state.appState)) {
      return true;
    }
    if (!_.isEqual(nextState.notification, this.state.notification)) {
      return true;
    }
    return false;
  }

  _handleRefresh = async () => {
    try {
      this.refreshing = true;
      this.forceUpdate();
      await this.props.getHomeScreen();
      await this.props.getTabNavigator();
      this.refreshing = false;
      this.forceUpdate();
    } catch (err) {
      console.log(err);
    }
  };

  renderHero = (data, index) => (
    <Hero
      key={index.toString()}
      src={data.image_bg}
      title={data.heading}
      text={data.description}
      titleColor={data.heading_color}
      textColor={data.description_color}
      overlayColor={data.overlay_color}
    />
  );

  renderHeading = (data, index) => {
    const { bg_color } = data;
    const backgroundColor = !!bg_color ? bg_color : Consts.colorGray2;
    return (
      <View
        key={index.toString()}
        style={{
          paddingTop: 20,
          paddingHorizontal: 10,
          backgroundColor
        }}
      >
        <Heading
          title={data.heading}
          text={data.description}
          mb={2}
          titleColor={data.heading_color}
          textColor={data.description_color}
        />
      </View>
    );
  };

  renderListing = (data, listingSettings, index) => {
    const { navigation, settings } = this.props;
    const style = listingSettings.style || "simple_slider";
    const { bg_color } = listingSettings;
    const backgroundColor = !!bg_color ? bg_color : Consts.colorGray2;
    return (
      <View
        style={{
          paddingBottom: 20,
          backgroundColor
        }}
        key={index.toString()}
      >
        {style === "modern_slider" ? (
          <ListingLayoutPopular
            data={data}
            navigation={navigation}
            colorPrimary={settings.colorPrimary}
          />
        ) : (
          <ListingLayoutHorizontal
            layout={style === "grid" ? "vertical" : "horizontal"}
            data={data}
            navigation={navigation}
            colorPrimary={settings.colorPrimary}
          />
        )}
      </View>
    );
  };

  renderCategories = (data, catSettings, index) => {
    const { navigation } = this.props;
    const { taxonomy, style } = catSettings;
    const { bg_color } = catSettings;
    const backgroundColor = !!bg_color ? bg_color : Consts.colorGray2;
    return (
      <View
        style={{
          paddingTop: 5,
          paddingBottom: 20,
          backgroundColor
        }}
        key={index.toString()}
      >
        <ListingLayoutCat
          layout={style === "grid" ? "vertical" : "horizontal"}
          data={data}
          renderItem={({ item }) => (
            <View style={{ margin: 5 }}>
              <ListingCat
                image={item.oTerm.featuredImg}
                name={he.decode(item.oTerm.name)}
                onPress={() =>
                  navigation.navigate("ListingCategories", {
                    categoryId: item.oTerm.term_id,
                    name: he.decode(item.oTerm.name),
                    taxonomy,
                    endpointAPI: item.restAPI
                  })
                }
                itemWidth={
                  style === "grid" ? SCREEN_WIDTH / 2 - 5 : SCREEN_WIDTH / 2.5
                }
              />
            </View>
          )}
        />
      </View>
    );
  };

  renderEvent = (data, eventSettings, index) => {
    const { translations, navigation } = this.props;
    const style = eventSettings.style || "simple_slider";
    const { bg_color } = eventSettings;
    const backgroundColor = !!bg_color ? bg_color : Consts.colorGray2;
    return (
      <View
        style={{
          paddingTop: 10,
          paddingBottom: 20,
          paddingHorizontal: 5,
          backgroundColor
        }}
        key={index.toString()}
      >
        <FlatList
          data={data}
          renderItem={({ item }) => {
            return (
              <View
                style={{
                  width:
                    style === "grid"
                      ? SCREEN_WIDTH / 2 - 5
                      : SCREEN_WIDTH / 1.8 + 10,
                  paddingHorizontal: 5,
                  marginBottom: 10
                }}
              >
                <EventItem
                  image={item.oFeaturedImg.medium}
                  name={he.decode(item.postTitle)}
                  date={
                    item.oCalendar
                      ? `${item.oCalendar.oStarts.date} - ${
                          item.oCalendar.oStarts.hour
                        }`
                      : null
                  }
                  address={he.decode(item.oAddress.address)}
                  hosted={`${translations.hostedBy} ${
                    item.oAuthor.displayName
                  }`}
                  interested={`${item.oFavorite.totalFavorites} ${
                    item.oFavorite.text
                  }`}
                  style={{
                    width: "100%"
                  }}
                  onPress={() =>
                    navigation.navigate("EventDetailScreen", {
                      id: item.ID,
                      name: he.decode(item.postTitle),
                      image:
                        SCREEN_WIDTH > 420
                          ? item.oFeaturedImg.large
                          : item.oFeaturedImg.medium,
                      address: he.decode(item.oAddress.address),
                      hosted: `${translations.hostedBy} ${
                        item.oAuthor.displayName
                      }`,
                      interested: `${item.oFavorite.totalFavorites} ${
                        item.oFavorite.text
                      }`
                    })
                  }
                />
              </View>
            );
          }}
          keyExtractor={item => item.ID.toString()}
          numColumns={style === "grid" ? 2 : 1}
          horizontal={style === "grid" ? false : true}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    );
  };

  renderContent = () => {
    const { homeScreen, translations, isHomeRequestTimeout } = this.props;
    const ViewWithLoading = WithLoading(View);
    return (
      <RequestTimeoutWrapped
        isTimeout={isHomeRequestTimeout && _.isEmpty(homeScreen)}
        onPress={this._getHomeAPIRequestTimeout}
        fullScreen={true}
        text={translations.networkError}
        buttonText={translations.retry}
      >
        <ViewWithLoading isLoading={homeScreen}>
          {homeScreen.map((section, index) => {
            if (section) {
              switch (section.TYPE) {
                case "HERO":
                  return this.renderHero(section, index);
                case "HEADING":
                  return this.renderHeading(section, index);
                case "LISTINGS":
                  return this.renderListing(
                    section.oResults,
                    section.oSettings,
                    index
                  );
                case "MODERN_TERM_BOXES":
                  return this.renderCategories(
                    section.oResults,
                    section.oSettings,
                    index
                  );
                case "EVENTS":
                  return this.renderEvent(
                    section.oResults,
                    section.oSettings,
                    index
                  );
                default:
                  return false;
              }
            }
          })}
        </ViewWithLoading>
      </RequestTimeoutWrapped>
    );
  };
  render() {
    const { navigation, settings, translations, auth } = this.props;
    const { isLoggedIn } = auth;
    return (
      <Layout
        navigation={navigation}
        colorPrimary={settings.colorPrimary}
        renderContent={this.renderContent}
        textSearch={translations.search}
        isLoggedIn={isLoggedIn}
        refreshControl={
          <RefreshControl
            refreshing={this.refreshing}
            onRefresh={this._handleRefresh}
            tintColor={settings.colorPrimary}
            progressBackgroundColor={Consts.colorGray1}
          />
        }
      />
    );
  }
}

const mapStateToProps = state => ({
  homeScreen: state.homeScreen,
  translations: state.translations,
  isHomeRequestTimeout: state.isHomeRequestTimeout,
  settings: state.settings,
  tabNavigator: state.tabNavigator,
  auth: state.auth,
  keyFirebase2: state.keyFirebase2,
  keyFirebase: state.keyFirebase,
  shortProfile: state.shortProfile
});

const mapDispatchToProps = {
  getHomeScreen,
  getTabNavigator,
  getShortProfile,
  readNewMessageChat,
  getKeyFirebase
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomeScreen);

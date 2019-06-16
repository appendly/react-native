import React, { Component } from "react";
import PropTypes from "prop-types";
import { View, FlatList, StyleSheet, Dimensions, Platform } from "react-native";
import _ from "lodash";
import he from "he";
import { connect } from "react-redux";
import { getEvents, getEventsLoadmore } from "../../actions";
import { EventItem } from "../dumbs";
import {
  MessageError,
  RequestTimeoutWrapped,
  ViewWithLoading,
  ContentLoader,
  Row,
  Col,
  bottomBarHeight
} from "../../wiloke-elements";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const END_REACHED_THRESHOLD = Platform.OS === "ios" ? 0 : 1;
const RADIUS = 10;

class EventsContainer extends Component {
  static defaultProps = {
    horizontal: false
  };

  static propTypes = {
    horizontal: PropTypes.bool
  };

  state = {
    startLoadmore: false,
    postType: null
  };

  _getId = postType => {
    const { categoryList, locationList } = this.props;
    const getId = arr => arr.filter(item => item.selected)[0].id;
    const categoryId =
      typeof categoryList[postType] !== "undefined" &&
      categoryList[postType].length > 0 &&
      getId(categoryList[postType]) !== "wilokeListingCategory"
        ? getId(categoryList[postType])
        : null;
    const locationId =
      typeof locationList[postType] !== "undefined" &&
      locationList[postType].length > 0 &&
      getId(locationList[postType]) !== "wilokeListingLocation"
        ? getId(locationList[postType])
        : null;
    return { categoryId, locationId };
  };

  _getEvents = async () => {
    try {
      const { locations, getEvents, navigation, nearByFocus } = this.props;
      const { coords } = locations.location;
      const nearby = {
        lat: coords.latitude,
        lng: coords.longitude,
        unit: "km",
        radius: RADIUS
      };
      const { state } = navigation;
      const nextRoute = navigation.dangerouslyGetParent().state;
      const postType = state.params ? state.params.key : nextRoute.key;
      const { categoryId, locationId } = this._getId(postType);
      await this.setState({ postType });
      await getEvents(
        categoryId,
        locationId,
        postType,
        nearByFocus ? nearBy : {}
      );
      this.setState({ startLoadmore: true });
    } catch (err) {
      console.log(err);
    }
  };

  componentDidMount() {
    this._getEvents();
  }

  _handleEndReached = next => {
    const { locations, getEventsLoadmore, nearByFocus } = this.props;
    const { coords } = locations.location;
    const nearby = {
      lat: coords.latitude,
      lng: coords.longitude,
      unit: "km",
      radius: RADIUS
    };
    const { postType } = this.state;
    const { startLoadmore } = this.state;
    const { categoryId, locationId } = this._getId(postType);
    startLoadmore &&
      next !== false &&
      getEventsLoadmore(
        next,
        categoryId,
        locationId,
        postType,
        nearByFocus ? nearby : {}
      );
  };

  renderItem = ({ item, index }) => {
    const { navigation, translations } = this.props;
    return (
      <Col column={2} gap={10}>
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
          hosted={`${translations.hostedBy} ${item.oAuthor.displayName}`}
          interested={`${item.oFavorite.totalFavorites} ${item.oFavorite.text}`}
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
              hosted: `${translations.hostedBy} ${item.oAuthor.displayName}`,
              interested: `${item.oFavorite.totalFavorites} ${
                item.oFavorite.text
              }`
            })
          }
        />
      </Col>
    );
  };

  _getWithLoadingProps = loading => ({
    isLoading: loading,
    contentLoader: "content",
    contentHeight: 90,
    contentLoaderItemLength: 6,
    featureRatioWithPadding: "56.25%",
    column: 2,
    gap: 10,
    containerPadding: 10
  });

  renderContentSuccess(loading, events) {
    const { startLoadmore } = this.state;
    return (
      <ViewWithLoading {...this._getWithLoadingProps(loading)}>
        <FlatList
          data={events.oResults}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => item.ID.toString() + index.toString()}
          numColumns={2}
          horizontal={false}
          showsHorizontalScrollIndicator={false}
          onEndReachedThreshold={END_REACHED_THRESHOLD}
          onEndReached={() => this._handleEndReached(events.next)}
          ListFooterComponent={() =>
            startLoadmore && events.next !== false ? (
              <View style={{ padding: 5 }}>
                <Row gap={10}>
                  {Array(2)
                    .fill(null)
                    .map((_, index) => (
                      <Col key={index.toString()} column={2} gap={10}>
                        <ContentLoader
                          featureRatioWithPadding="56.25%"
                          contentHeight={90}
                          content={true}
                        />
                      </Col>
                    ))}
                </Row>
              </View>
            ) : (
              <View style={{ paddingBottom: 20 + bottomBarHeight }} />
            )
          }
          style={{ padding: 5 }}
        />
      </ViewWithLoading>
    );
  }

  renderContentError(loading, events) {
    return (
      <ViewWithLoading {...this._getWithLoadingProps(loading)}>
        <MessageError message={events.msg} />
      </ViewWithLoading>
    );
  }

  render() {
    const { events, isEventRequestTimeout, loading, translations } = this.props;
    return (
      <RequestTimeoutWrapped
        isTimeout={isEventRequestTimeout && _.isEmpty(events.oResults)}
        onPress={this._getEvents}
        fullScreen={true}
        style={styles.container}
        text={translations.networkError}
        buttonText={translations.retry}
      >
        {!_.isEmpty(events) && events.oResults
          ? this.renderContentSuccess(loading, events)
          : this.renderContentError(loading, events)}
      </RequestTimeoutWrapped>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row"
  }
});

const mapStateToProps = state => ({
  events: state.events,
  loading: state.loading,
  locationList: state.locationList,
  categoryList: state.categoryList,
  translations: state.translations,
  isEventRequestTimeout: state.isEventRequestTimeout,
  nearByFocus: state.nearByFocus,
  locations: state.locations
});

const mapDispatchToProps = {
  getEvents,
  getEventsLoadmore
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EventsContainer);

import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { View, Platform, FlatList, StyleSheet, Dimensions } from "react-native";
import _ from "lodash";
import he from "he";
import { connect } from "react-redux";
import { getListings, getListingsLoadmore } from "../../actions";
import ListingItem from "../dumbs/ListingItem";
import {
  MessageError,
  RequestTimeoutWrapped,
  ViewWithLoading,
  ContentLoader,
  Row,
  Col,
  bottomBarHeight
} from "../../wiloke-elements";

const RADIUS = 10;
const END_REACHED_THRESHOLD = Platform.OS === "ios" ? 0 : 1;
const { with: SCREEN_WIDTH } = Dimensions.get("window");

class ListingsContainer extends Component {
  static defaultProps = {
    horizontal: false
  };

  static propTypes = {
    horizontal: PropTypes.bool
  };

  state = {
    refreshing: false,
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

  _getListing = async () => {
    try {
      const { locations, getListings, navigation, nearByFocus } = this.props;
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
      await getListings(
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
    this._getListing();
  }

  _handleRefresh = async () => {
    try {
      this.setState({ refreshing: true });
      await this._getListing();
      this.setState({ refreshing: false });
    } catch (err) {
      console.log(err);
    }
  };

  _handleEndReached = next => {
    const { locations, getListingsLoadmore, nearByFocus } = this.props;
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
      getListingsLoadmore(
        next,
        categoryId,
        locationId,
        postType,
        nearByFocus ? nearby : {}
      );
  };

  renderItem = ({ item }) => {
    const { navigation, settings } = this.props;
    return (
      <ListingItem
        image={item.oFeaturedImg.medium}
        title={he.decode(item.postTitle)}
        tagline={item.tagLine ? he.decode(item.tagLine) : null}
        logo={item.logo !== "" ? item.logo : item.oFeaturedImg.thumbnail}
        location={he.decode(item.oAddress.address)}
        reviewMode={item.oReview.mode}
        reviewAverage={item.oReview.average}
        businessStatus={item.businessStatus}
        colorPrimary={settings.colorPrimary}
        onPress={() =>
          navigation.navigate("ListingDetailScreen", {
            id: item.ID,
            name: he.decode(item.postTitle),
            tagline: !!item.tagLine ? he.decode(item.tagLine) : null,
            link: item.postLink,
            author: item.oAuthor,
            image:
              SCREEN_WIDTH > 420
                ? item.oFeaturedImg.large
                : item.oFeaturedImg.medium,
            logo: item.logo !== "" ? item.logo : item.oFeaturedImg.thumbnail
          })
        }
        layout={this.props.horizontal ? "horizontal" : "vertical"}
      />
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

  renderContentSuccess(listings) {
    const { startLoadmore } = this.state;
    return (
      <FlatList
        data={listings.oResults}
        renderItem={this.renderItem}
        keyExtractor={(item, index) => item.ID.toString() + index.toString()}
        numColumns={this.props.horizontal ? 1 : 2}
        horizontal={this.props.horizontal}
        showsHorizontalScrollIndicator={false}
        onEndReachedThreshold={END_REACHED_THRESHOLD}
        onEndReached={() => this._handleEndReached(listings.next)}
        ListFooterComponent={() =>
          startLoadmore && listings.next !== false ? (
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
    );
  }

  renderContentError(listings) {
    return listings && <MessageError message={listings.msg} />;
  }

  render() {
    const {
      listings,
      isListingRequestTimeout,
      loading,
      translations
    } = this.props;
    const { postType } = this.state;
    const condition =
      !_.isEmpty(listings[postType]) && listings[postType].status === "success";
    return (
      <ViewWithLoading {...this._getWithLoadingProps(loading)}>
        <RequestTimeoutWrapped
          isTimeout={isListingRequestTimeout && _.isEmpty(listings[postType])}
          onPress={this._getListing}
          fullScreen={true}
          style={styles.container}
          text={translations.networkError}
          buttonText={translations.retry}
        >
          {condition
            ? this.renderContentSuccess(listings[postType])
            : this.renderContentError(listings[postType])}
        </RequestTimeoutWrapped>
      </ViewWithLoading>
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
  listings: state.listings,
  loading: state.loading,
  locationList: state.locationList,
  categoryList: state.categoryList,
  isListingRequestTimeout: state.isListingRequestTimeout,
  nearByFocus: state.nearByFocus,
  locations: state.locations,
  translations: state.translations,
  settings: state.settings
});

const mapDispatchToProps = {
  getListings,
  getListingsLoadmore
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ListingsContainer);

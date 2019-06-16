import React, { Component } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { connect } from "react-redux";
import {
  changeListingDetailNavigation,
  getListingPhotos,
  getScrollTo
} from "../../actions";
import {
  NewGallery,
  ViewWithLoading,
  isEmpty,
  ContentBox,
  RequestTimeoutWrapped
} from "../../wiloke-elements";
import { ButtonFooterContentBox } from "../dumbs";

class ListingPhotosContainer extends Component {
  state = {
    imageIndex: 0,
    isImageViewVisible: false,
    isLoading: true
  };

  _getListingPhotos = async () => {
    const { params, getListingPhotos, type } = this.props;
    const { id, item, max } = params;
    type === null && (await getListingPhotos(id, item.key, max));
    this.setState({ isLoading: false });
  };

  async componentDidMount() {
    this._getListingPhotos();
  }

  renderContent = (id, item, isLoading, photos, type) => {
    const {
      isListingDetailPhotosRequestTimeout,
      translations,
      settings
    } = this.props;
    return (
      <ViewWithLoading
        isLoading={isLoading}
        contentLoader="contentSquareHeader"
        contentSquareWidth="33.33%"
      >
        {!isEmpty(photos) && (
          <ContentBox
            headerTitle={item.name}
            headerIcon={item.icon}
            style={{ marginBottom: type !== "all" ? 10 : 50 }}
            renderFooter={
              item.status &&
              item.status === "yes" &&
              this.renderFooterContentBox(id, item.key)
            }
            colorPrimary={settings.colorPrimary}
          >
            <RequestTimeoutWrapped
              isTimeout={isListingDetailPhotosRequestTimeout}
              onPress={this._getListingPhotos}
              text={translations.networkError}
              buttonText={translations.retry}
            >
              <NewGallery
                thumbnails={photos.medium}
                modalSlider={photos.large}
                thumbnailMax={type !== "all" && 3}
                colorPrimary={settings.colorPrimary}
              />
            </RequestTimeoutWrapped>
          </ContentBox>
        )}
      </ViewWithLoading>
    );
  };

  renderFooterContentBox = (listingId, key) => {
    const {
      translations,
      changeListingDetailNavigation,
      getListingPhotos,
      getScrollTo
    } = this.props;
    return (
      <ButtonFooterContentBox
        text={translations.viewAll.toUpperCase()}
        onPress={() => {
          changeListingDetailNavigation(key);
          getListingPhotos(listingId, key, null);
          getScrollTo(0);
        }}
      />
    );
  };

  render() {
    const {
      listingPhotos,
      listingPhotosAll,
      loadingListingDetail,
      params,
      type
    } = this.props;
    const { id, item } = params;
    const { isLoading } = this.state;
    return type === "all"
      ? this.renderContent(
          id,
          item,
          loadingListingDetail,
          listingPhotosAll,
          "all"
        )
      : this.renderContent(id, item, isLoading, listingPhotos);
  }
  // renderFooter = () => {
  //   const {
  //     params,
  //     translations,
  //     changeListingDetailNavigation,
  //     getListingPhotos
  //   } = this.props;
  //   const { status, key } = params.item;
  //   const listingId = params.id;
  //   return (
  //     status === "yes" && (
  //       <ButtonFooterContentBox
  //         text={translations.viewAll.toUpperCase()}
  //         onPress={() => {
  //           changeListingDetailNavigation(key);
  //           getListingPhotos(listingId, key, null);
  //         }}
  //       />
  //     )
  //   );
  // };
  // render() {
  //   const { params, listingPhotos } = this.props;
  //   return (
  //     !isEmpty(listingPhotos) && (
  //       <ContentBox
  //         headerTitle={params.item.name}
  //         headerIcon="image"
  //         style={stylesBase.mb10}
  //         // renderFooter={this.renderFooter()}
  //       >
  //         {this.renderGallery()}
  //       </ContentBox>
  //     )
  //   );
  // }
}

const mapStateToProps = state => ({
  listingPhotos: state.listingPhotos,
  listingPhotosAll: state.listingPhotosAll,
  translations: state.translations,
  loadingListingDetail: state.loadingListingDetail,
  isListingDetailPhotosRequestTimeout:
    state.isListingDetailPhotosRequestTimeout,
  settings: state.settings
});

export default connect(
  mapStateToProps,
  {
    changeListingDetailNavigation,
    getListingPhotos,
    getScrollTo
  }
)(ListingPhotosContainer);

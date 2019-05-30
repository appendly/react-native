import React, { Component } from "react";
import { View } from "react-native";
import { connect } from "react-redux";
import {
  changeListingDetailNavigation,
  getListingVideos,
  getScrollTo
} from "../../actions";
import {
  Row,
  Col,
  ViewWithLoading,
  Video,
  isEmpty,
  ContentBox,
  RequestTimeoutWrapped
} from "../../wiloke-elements";
import { ButtonFooterContentBox } from "../dumbs";

class ListingVideosContainer extends Component {
  state = {
    isLoading: true
  };

  _getListingVideos = async () => {
    const { params, getListingVideos, type } = this.props;
    const { id, item, max } = params;
    type === null && (await getListingVideos(id, item.key, max));
    this.setState({ isLoading: false });
  };
  componentDidMount() {
    this._getListingVideos();
  }

  renderContent = (id, item, isLoading, videos, type) => {
    const {
      isListingDetailVideosRequestTimeout,
      translations,
      settings
    } = this.props;
    return (
      <ViewWithLoading isLoading={isLoading} contentLoader="contentHeader">
        {!isEmpty(videos) && (
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
              isTimeout={isListingDetailVideosRequestTimeout}
              onPress={this._getListingVideos}
              text={translations.networkError}
              buttonText={translations.retry}
            >
              <Row gap={10}>
                {videos.map((item, index) => (
                  <Col key={index.toString()} column={1} gap={10}>
                    <Video source={item.src} thumbnail={item.thumbnail} />
                  </Col>
                ))}
              </Row>
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
      getListingVideos,
      getScrollTo
    } = this.props;
    return (
      <ButtonFooterContentBox
        text={translations.viewAll.toUpperCase()}
        onPress={() => {
          changeListingDetailNavigation(key);
          getListingVideos(listingId, key, null);
          getScrollTo(0);
        }}
      />
    );
  };

  render() {
    const {
      listingVideos,
      listingVideosAll,
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
          listingVideosAll,
          "all"
        )
      : this.renderContent(id, item, isLoading, listingVideos);
  }
}

const mapStateToProps = state => ({
  listingVideos: state.listingVideos,
  listingVideosAll: state.listingVideosAll,
  loadingListingDetail: state.loadingListingDetail,
  translations: state.translations,
  isListingDetailVideosRequestTimeout:
    state.isListingDetailVideosRequestTimeout,
  settings: state.settings
});

export default connect(
  mapStateToProps,
  {
    changeListingDetailNavigation,
    getListingVideos,
    getScrollTo
  }
)(ListingVideosContainer);

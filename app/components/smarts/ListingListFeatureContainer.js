import React, { Component } from "react";
import { View } from "react-native";
import { connect } from "react-redux";
import he from "he";
import {
  changeListingDetailNavigation,
  getListingListFeature,
  getListingBoxCustom,
  getScrollTo
} from "../../actions";
import {
  isEmpty,
  Row,
  Col,
  IconTextMedium,
  ViewWithLoading,
  ContentBox,
  RequestTimeoutWrapped
} from "../../wiloke-elements";
import { ButtonFooterContentBox } from "../dumbs";
import * as Consts from "../../constants/styleConstants";

class ListingListFeatureContainer extends Component {
  state = {
    isLoading: true
  };

  async _getListingFeature() {
    try {
      const {
        params,
        getListingListFeature,
        getListingBoxCustom,
        type
      } = this.props;
      const { id, item, max } = params;
      type === null &&
        (await (item.key === "tags"
          ? getListingListFeature(id, item.key, max)
          : getListingBoxCustom(id, item.key, max)));
      this.setState({ isLoading: false });
    } catch (err) {
      console.log(err);
    }
  }

  componentDidMount() {
    this._getListingFeature();
  }

  renderContent = (id, item, isLoading, listFeature, type) => {
    const {
      isListingDetailListRequestTimeout,
      translations,
      settings
    } = this.props;
    return (
      <ViewWithLoading isLoading={isLoading} contentLoader="contentHeader">
        {!isEmpty(listFeature) && (
          <ContentBox
            headerTitle={item.name}
            headerIcon="list"
            style={{ marginBottom: type !== "all" ? 10 : 50 }}
            renderFooter={
              item.status &&
              item.status === "yes" &&
              this.renderFooterContentBox(id, item.key)
            }
            colorPrimary={settings.colorPrimary}
          >
            <RequestTimeoutWrapped
              isTimeout={isListingDetailListRequestTimeout}
              onPress={this._getListingFeature}
              text={translations.networkError}
              buttonText={translations.retry}
            >
              <Row gap={15}>
                {listFeature.map((item, index) => (
                  <Col key={index.toString()} column={2} gap={15}>
                    <IconTextMedium
                      iconName={item.oIcon.icon}
                      iconSize={30}
                      text={he.decode(item.name)}
                      texNumberOfLines={1}
                      iconBackgroundColor={
                        item.oIcon.color && item.oIcon.color !== ""
                          ? item.oIcon.color
                          : Consts.colorGray2
                      }
                      iconColor={
                        item.oIcon.color && item.oIcon.color !== ""
                          ? "#fff"
                          : Consts.colorDark2
                      }
                    />
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
      getListingListFeature,
      getScrollTo
    } = this.props;
    return (
      <ButtonFooterContentBox
        text={translations.viewAll.toUpperCase()}
        onPress={() => {
          changeListingDetailNavigation(key);
          getListingListFeature(listingId, key, null);
          getScrollTo(0);
        }}
      />
    );
  };

  render() {
    const {
      listingListFeature,
      listingListFeatureAll,
      loadingListingDetail,
      listingCustomBox,
      type,
      params
    } = this.props;
    const { id, item } = params;
    const { isLoading } = this.state;
    return type === "all"
      ? this.renderContent(
          id,
          item,
          loadingListingDetail,
          item.key === "tags"
            ? listingListFeatureAll
            : listingCustomBox[item.key],
          "all"
        )
      : this.renderContent(
          id,
          item,
          isLoading,
          item.key === "tags" ? listingListFeature : listingCustomBox[item.key]
        );
  }
}

const mapStateToProps = state => ({
  listingListFeature: state.listingListFeature,
  listingListFeatureAll: state.listingListFeatureAll,
  loadingListingDetail: state.loadingListingDetail,
  translations: state.translations,
  isListingDetailListRequestTimeout: state.isListingDetailListRequestTimeout,
  settings: state.settings,
  listingCustomBox: state.listingCustomBox
});

const mapDispatchToProps = {
  changeListingDetailNavigation,
  getListingListFeature,
  getListingBoxCustom,
  getScrollTo
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ListingListFeatureContainer);

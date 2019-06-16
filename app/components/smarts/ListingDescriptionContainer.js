import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import { connect } from "react-redux";
import _ from "lodash";
import he from "he";
import {
  getListingBoxCustom,
  getListingDescription,
  changeListingDetailNavigation,
  getScrollTo
} from "../../actions";
import stylesBase from "../../stylesBase";
import {
  ViewWithLoading,
  ContentBox,
  isEmpty,
  RequestTimeoutWrapped,
  HtmlViewer
} from "../../wiloke-elements";
import { ButtonFooterContentBox } from "../dumbs";
import * as Consts from "../../constants/styleConstants";

class ListingDescriptionContainer extends Component {
  state = {
    isLoading: true
  };

  _getListingDescription = async () => {
    try {
      const {
        params,
        getListingDescription,
        getListingBoxCustom,
        type
      } = this.props;
      const { id, item, max } = params;
      type === null &&
        (await (item.key === "content"
          ? getListingDescription(id, item.key, max)
          : getListingBoxCustom(id, item.key, max)));
      this.setState({ isLoading: false });
    } catch (err) {
      console.log(err);
    }
  };

  componentDidMount() {
    this._getListingDescription();
  }

  renderContent = (id, item, isLoading, descriptions, type) => {
    const {
      isListingDetailDesRequestTimeout,
      translations,
      settings
    } = this.props;
    return (
      <ViewWithLoading isLoading={isLoading} contentLoader="contentHeader">
        {!isEmpty(descriptions) && (
          <ContentBox
            headerTitle={item.name}
            headerIcon="file-text"
            style={{ marginBottom: type !== "all" ? 10 : 50 }}
            renderFooter={
              item.status &&
              item.status === "yes" &&
              this.renderFooterContentBox(id, item.key)
            }
            colorPrimary={settings.colorPrimary}
          >
            <RequestTimeoutWrapped
              isTimeout={isListingDetailDesRequestTimeout}
              onPress={this._getListingDescription}
              text={translations.networkError}
              buttonText={translations.retry}
            >
              {descriptions[0].search(/<(img|div|p|span|strong|i|a|br)/g) !==
              -1 ? (
                <View style={{ marginLeft: -10 }}>
                  <HtmlViewer
                    html={descriptions[0]}
                    htmlWrapCssString={`font-size: 13px; color: ${
                      Consts.colorDark2
                    }; line-height: 1.4em`}
                    containerMaxWidth={Consts.screenWidth - 22}
                    containerStyle={{ paddingLeft: 10, paddingRight: 0 }}
                  />
                </View>
              ) : (
                <Text style={stylesBase.text}>
                  {he.decode(descriptions[0])}
                </Text>
              )}
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
      getListingDescription,
      getScrollTo
    } = this.props;
    return (
      <ButtonFooterContentBox
        text={translations.viewAll.toUpperCase()}
        onPress={() => {
          changeListingDetailNavigation(key);
          getListingDescription(listingId, key, null);
          getScrollTo(0);
        }}
      />
    );
  };

  render() {
    const {
      listingCustomBox,
      listingDescription,
      listingDescriptionAll,
      loadingListingDetail,
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
          item.key === "content"
            ? listingDescriptionAll
            : listingCustomBox[item.key],
          "all"
        )
      : this.renderContent(
          id,
          item,
          isLoading,
          item.key === "content"
            ? listingDescription
            : listingCustomBox[item.key]
        );
  }
}

const htmlViewStyles = StyleSheet.create({
  div: {
    fontSize: 13,
    color: Consts.colorDark2,
    lineHeight: 19
  },
  a: {
    textDecorationLine: "underline"
  },
  blockquote: {
    fontSize: 14,
    fontStyle: "italic",
    color: Consts.colorDark3,
    marginVertical: 10
  },
  strong: {
    display: "flex"
  }
});

const mapStateToProps = state => ({
  translations: state.translations,
  listingCustomBox: state.listingCustomBox,
  listingDescription: state.listingDescription,
  listingDescriptionAll: state.listingDescriptionAll,
  loadingListingDetail: state.loadingListingDetail,
  isListingDetailDesRequestTimeout: state.isListingDetailDesRequestTimeout,
  settings: state.settings
});

const mapDispatchToProps = {
  getListingBoxCustom,
  getListingDescription,
  changeListingDetailNavigation,
  getScrollTo
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ListingDescriptionContainer);

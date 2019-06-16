import React, { Component } from "react";
import PropTypes from "prop-types";
import { View, Text } from "react-native";
import { connect } from "react-redux";
import { getListingSidebar } from "../../actions";
import {
  ViewWithLoading,
  ContentBox,
  isEmpty,
  RequestTimeoutWrapped,
  P,
  HtmlViewer
} from "../../wiloke-elements";
import * as Consts from "../../constants/styleConstants";
import {
  ListingHours,
  ListingBusinessInfo,
  PriceRange,
  ListingCatList,
  ListingStatistic,
  ListingTagList
} from "../dumbs";

class ListingSidebarContainer extends Component {
  static propTypes = {
    navigation: PropTypes.object
  };

  state = {
    isLoading: true
  };

  _getListingSidebar = async () => {
    const { getListingSidebar, listingId } = this.props;
    await getListingSidebar(listingId);
    this.setState({ isLoading: false });
  };
  componentDidMount() {
    this._getListingSidebar();
  }

  // _getIcon = key => {
  //   switch (key) {
  //     case "businessHours":
  //       return "clock";
  //     case "categories":
  //       return "layers";
  //     case "statistic":
  //       return "bar-chart-2";
  //     case "tags":
  //       return "tag";
  //     case "businessInfo":
  //       return "repeat";
  //     default:
  //       return "check-circle";
  //   }
  // };

  _checkItemContent = item => {
    const { navigation, translations, settings } = this.props;
    switch (item.aSettings.key) {
      case "businessHours":
        return (
          <ListingHours
            data={item.oContent}
            alwaysOpenText={translations.always_open}
          />
        );
      case "priceRange":
        return (
          <View>
            {!!item.oContent.desc && (
              <P style={{ paddingBottom: 5 }}>{item.oContent.desc}</P>
            )}
            <PriceRange
              data={item.oContent}
              colorPrimary={settings.colorPrimary}
            />
          </View>
        );
      case "categories":
        return <ListingCatList data={item.oContent} />;
      case "statistic":
        return <ListingStatistic data={item.oContent} />;
      case "tags":
        return <ListingTagList data={item.oContent} />;
      case "businessInfo":
        return (
          <ListingBusinessInfo data={item.oContent} navigation={navigation} />
        );
      case "được_tài_trợ":
        return (
          <View style={{ marginLeft: -10 }}>
            <HtmlViewer
              html={item.aSettings.content}
              htmlWrapCssString={`font-size: 13px; color: ${
                Consts.colorDark2
              }; line-height: 1.4em`}
              containerMaxWidth={Consts.screenWidth - 22}
              containerStyle={{ paddingLeft: 10, paddingRight: 0 }}
            />
          </View>
        );
      default:
        return false;
    }
  };

  renderStatusHours = item => {
    if (!item.oContent.oDetails) {
      return false;
    }
    const { status, text } = item.oContent.oDetails.oCurrent;
    return (
      <View
        style={{
          borderWidth: 1,
          borderColor:
            status === "closed" || status === "close" || status === "day_off"
              ? Consts.colorQuaternary
              : Consts.colorSecondary,
          borderRadius: 2,
          paddingVertical: 3,
          paddingHorizontal: 8
        }}
      >
        <Text
          style={{
            fontSize: 12,
            color:
              status === "closed" || status === "close" || status === "day_off"
                ? Consts.colorQuaternary
                : Consts.colorSecondary
          }}
        >
          {text}
        </Text>
      </View>
    );
  };

  renderItem = (item, index) => {
    const { settings } = this.props;
    if (typeof item === "object") {
      const { key, name, icon } = item.aSettings;
      return (
        item.oContent.mode !== "no_hours_available" && (
          <ContentBox
            key={key}
            headerTitle={name ? name : ""}
            headerIcon={icon}
            renderRight={() => {
              return key === "businessHours" && this.renderStatusHours(item);
            }}
            style={{ marginBottom: 10 }}
            colorPrimary={settings.colorPrimary}
          >
            {this._checkItemContent(item)}
          </ContentBox>
        )
      );
    }
  };

  render() {
    const { isLoading } = this.state;
    const {
      listingSidebar,
      isListingDetailSidebarRequestTimeout,
      translations
    } = this.props;
    return (
      <RequestTimeoutWrapped
        isTimeout={isListingDetailSidebarRequestTimeout}
        onPress={this._getListingSidebar}
        text={translations.networkError}
        buttonText={translations.retry}
      >
        <ViewWithLoading isLoading={isLoading}>
          {!isEmpty(listingSidebar) && listingSidebar.map(this.renderItem)}
        </ViewWithLoading>
      </RequestTimeoutWrapped>
    );
  }
}

const mapStateToProps = state => ({
  listingSidebar: state.listingSidebar,
  translations: state.translations,
  isListingDetailSidebarRequestTimeout:
    state.isListingDetailSidebarRequestTimeout,
  settings: state.settings
});

export default connect(
  mapStateToProps,
  { getListingSidebar }
)(ListingSidebarContainer);

import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  View,
  Dimensions,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  ScrollView,
  StatusBar,
  ViewPropTypes
} from "react-native";
import { HeaderHasBack, OfflineNotice } from "../../wiloke-elements";
import { Constants } from "expo";
import Header from "./Header";
import HeaderHasFilter from "./HeaderHasFilter";
import * as Consts from "../../constants/styleConstants";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const HEADER_HEIGHT = 52 + Constants.statusBarHeight;
const CONTENT_HEIGHT = SCREEN_HEIGHT - HEADER_HEIGHT - 50;
const CONTENT_MAX_WIDTH = 600;

export default class Layout extends Component {
  renderHeader() {
    const { navigation, colorPrimary, headerType } = this.props;
    switch (headerType) {
      case "headerHasBack":
        return (
          <HeaderHasBack {...this.props} headerBackgroundColor={colorPrimary} />
        );
      case "headerHasFilter":
        return (
          <HeaderHasFilter {...this.props} backgroundColor={colorPrimary} />
        );
      default:
        return (
          <Header
            navigation={navigation}
            {...this.props}
            backgroundColor={colorPrimary}
          />
        );
    }
  }
  renderContent() {
    return (
      <View
        style={{
          minHeight: this.props.contentHeight
        }}
        // behavior="padding"
        // enabled
      >
        {this.props.renderContent()}
        <View style={{ height: 20 }} />
      </View>
    );
  }
  render() {
    const contentStyle = [
      {
        height: this.props.contentHeight,
        backgroundColor: "#fff",
        maxWidth: CONTENT_MAX_WIDTH,
        width: "100%"
      },
      this.props.scrollViewStyle
    ];
    return (
      <View>
        {this.props.renderHeader
          ? this.props.renderHeader(HEADER_HEIGHT)
          : this.renderHeader()}
        <OfflineNotice />
        <StatusBar barStyle={this.props.statusBarStyle} />
        {this.props.renderBeforeContent()}
        {this.props.keyboardDismiss ? (
          <TouchableWithoutFeedback
            onPress={Keyboard.dismiss}
            accessible={false}
            style={{ flex: 1 }}
          >
            <View style={{ position: "relative", alignItems: "center" }}>
              {this.props.scrollViewEnabled ? (
                <ScrollView
                  style={contentStyle}
                  ref={this.props.scrollViewRef}
                  keyboardDismissMode="on-drag"
                  keyboardShouldPersistTaps="always"
                  {...this.props}
                >
                  {this.renderContent()}
                </ScrollView>
              ) : (
                <View style={contentStyle}>{this.renderContent()}</View>
              )}
            </View>
          </TouchableWithoutFeedback>
        ) : (
          <View style={{ alignItems: "center" }}>
            {this.props.scrollViewEnabled ? (
              <ScrollView
                ref={this.props.scrollViewRef}
                style={contentStyle}
                refreshControl={this.props.refreshControl}
                contentInset={this.props.contentInset}
                contentOffset={this.props.contentOffset}
                keyboardDismissMode="on-drag"
                keyboardShouldPersistTaps="always"
                scrollEnabled={this.props.scrollEnabled}
                {...this.props}
              >
                {this.props.renderContent()}
                <View style={{ height: 20 }} />
              </ScrollView>
            ) : (
              <View style={contentStyle}>
                {this.props.renderContent()}
                <View style={{ height: 20 }} />
              </View>
            )}
          </View>
        )}
        {this.props.renderAfterContent()}
      </View>
    );
  }
}
Layout.propTypes = {
  renderContent: PropTypes.func,
  renderBeforeContent: PropTypes.func,
  renderAfterContent: PropTypes.func,
  headerType: PropTypes.oneOf(["default", "headerHasFilter", "headerHasBack"]),
  contentScrollView: PropTypes.bool,
  scrollViewStyle: ViewPropTypes.style,
  scrollEnabled: PropTypes.bool,
  scrollViewEnabled: PropTypes.bool,
  contentHeight: PropTypes.number,
  statusBarStyle: PropTypes.string,
  scrollViewRef: PropTypes.func
};
Layout.defaultProps = {
  keyboardDismiss: false,
  scrollViewEnabled: true,
  contentHeight: CONTENT_HEIGHT,
  statusBarStyle: "light-content",
  renderContent: () => {},
  renderBeforeContent: () => {},
  renderAfterContent: () => {}
};

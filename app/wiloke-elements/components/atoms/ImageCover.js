import React, { PureComponent, Fragment } from "react";
import PropTypes from "prop-types";
import { View, Animated, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo";
import ImageProgress from "react-native-image-progress";
import * as Consts from "../../../constants/styleConstants";

export default class ImageCover extends PureComponent {
  static propTypes = {
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    borderRadius: PropTypes.number,
    blurRadius: PropTypes.number,
    overlay: PropTypes.number,
    animated: PropTypes.bool,
    src: PropTypes.string
  };
  static defaultProps = {
    width: "100%",
    animated: false
  };

  renderOverlay = () => (
    <Fragment>
      {typeof this.props.linearGradient === "object" ? (
        <LinearGradient
          colors={this.props.linearGradient}
          start={{ x: 0.0, y: 1.0 }}
          end={{ x: 1.0, y: 1.0 }}
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            zIndex: 1,
            opacity: this.props.overlay
          }}
        />
      ) : (
        <View
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            zIndex: 1,
            backgroundColor: Consts.colorDark,
            opacity: this.props.overlay
          }}
        />
      )}
    </Fragment>
  );

  _getPadding = modifier => {
    switch (modifier) {
      case "16by9":
        return { paddingTop: "56.25%" };
      case "4by3":
        return { paddingTop: "75%" };
      default:
        return { paddingTop: "100%" };
    }
  };

  renderContent = () => {
    const { src, blurRadius, overlay, modifier, height } = this.props;
    return (
      <Fragment>
        <ImageProgress
          source={{ uri: src }}
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
          }}
          blurRadius={blurRadius}
          indicator={ActivityIndicator}
        />
        <View style={height ? { height } : this._getPadding(modifier)} />
        {typeof overlay === "number" && this.renderOverlay()}
      </Fragment>
    );
  };

  render() {
    const { width, styles } = this.props;
    const styleView = [
      { width },
      styles,
      {
        position: "relative",
        zIndex: 1,
        overflow: "hidden",
        borderRadius: this.props.borderRadius
      }
    ];
    return (
      <Fragment>
        {this.props.animated ? (
          <Animated.View style={styleView}>
            {this.renderContent()}
          </Animated.View>
        ) : (
          <View style={styleView}>{this.renderContent()}</View>
        )}
      </Fragment>
    );
  }
}

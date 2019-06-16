import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import {
  View,
  TouchableOpacity,
  WebView,
  Animated,
  ImageBackground,
  StyleSheet,
  ViewPropTypes
} from "react-native";
import { Feather } from "@expo/vector-icons";
import stylesBase from "../../../stylesBase";

export default class Video extends PureComponent {
  static propTypes = {
    ratio: PropTypes.number,
    source: PropTypes.string.isRequired,
    style: ViewPropTypes.style,
    thumbnail: PropTypes.string
  };

  static defaultProps = {
    ratio: (9 / 16) * 100
  };

  state = {
    width: 0,
    opacity: new Animated.Value(1)
  };

  _handlePress = () => {
    Animated.timing(this.state.opacity, {
      toValue: 0,
      duration: 400,
      useNativeDriver: true
    }).start();
  };

  _onLayout = event => {
    const { width } = event.nativeEvent.layout;
    this.setState({ width });
  };

  _handleSource = () => {
    const { source } = this.props;
    let _source = "";
    const isYoutube =
      source.search(/(w{3}\.|http(s|):\/\/.*)youtu(\.|)be/g) !== -1;
    const isVimeo = source.search(/.*vimeo\.com\//g) !== -1;
    if (isYoutube) {
      _source = `https://www.youtube.com/embed/${source.replace(
        /.*youtu(\.|)be.*(\/|watch\?v=|embed\/)/g,
        ""
      )}?rel=0&amp;showinfo=0&amp;modestbranding=1`;
    } else if (isVimeo) {
      _source = `https://player.vimeo.com/video/${source.replace(
        /.*vimeo\.com\/(video\/|)/g,
        ""
      )}`;
    }
    return _source;
  };

  renderHtmlContent = () => {
    const htmlStyles = {
      wrapper: `
        position: relative,
        padding-top: ${this.props.ratio}%
      `,
      iframe: `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      `
    };
    const htmlContent = `
      <div style="${htmlStyles.wrapper}">
        <iframe
            style="${htmlStyles.iframe}"
            src="${this._handleSource()}"
            frameborder="0"
            allow="autoplay; encrypted-media"
            allowfullscreen
        ></iframe>
      </div>
    `;
    return htmlContent;
  };

  render() {
    const { width, opacity } = this.state;
    const sizePlayButton = width / 4 < 60 ? width / 4 : 60;
    return (
      <View
        onLayout={this._onLayout}
        style={[styles.container, this.props.style]}
      >
        <TouchableOpacity
          style={styles.container}
          activeOpacity={1}
          onPress={this._handlePress}
        >
          <WebView
            source={{ html: this.renderHtmlContent() }}
            scrollEnabled={false}
            style={[{ paddingTop: `${this.props.ratio}%`, width }]}
          />
          <Animated.View
            style={[styles.placeholder, stylesBase.absFull, { opacity }]}
            pointerEvents="none"
          >
            <ImageBackground
              source={{ uri: this.props.thumbnail }}
              style={styles.imageBg}
            >
              <View
                style={[
                  styles.iconWrap,
                  {
                    width: sizePlayButton,
                    height: sizePlayButton,
                    borderRadius: sizePlayButton / 2,
                    backgroundColor: "rgba(255, 255, 255, 0.25)"
                  }
                ]}
              >
                <Feather name="play" size={sizePlayButton / 2} color="#fff" />
              </View>
              <View style={[styles.overlay, stylesBase.absFull]} />
            </ImageBackground>
          </Animated.View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    width: "100%"
  },
  placeholder: {
    zIndex: 9
  },
  imageBg: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%"
  },
  overlay: {
    zIndex: -1,
    backgroundColor: "#000",
    opacity: 0.5
  },
  iconWrap: {
    position: "relative",
    zIndex: 9,
    justifyContent: "center",
    alignItems: "center"
  }
});

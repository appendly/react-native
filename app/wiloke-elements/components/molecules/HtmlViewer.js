import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  StyleSheet,
  Linking,
  ViewPropTypes,
  Image
} from "react-native";
import HTML from "react-native-render-html";
import ImageProgress from "react-native-image-progress";
import {
  colorPrimary,
  colorDark1
} from "../../../constants/styleConstants";
import { DeepLinkingSocial } from "../../";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CONTAINER_PADDING = 10;

class ImageAutoSize extends PureComponent {
  constructor(props) {
    super(props);
    const { maxWidth, width, height } = this.props;
    this.state = {
      imageStyle: {
        maxWidth,
        width,
        height: height === 0 ? 100 : height * maxWidth / width,
        marginLeft: (maxWidth - width < 30) ? -CONTAINER_PADDING : 0
      }
    }
  }

  componentDidMount() {
    const { source, maxWidth, width, height } = this.props;
    Image.getSize(source.uri, (_width, _height) => {
      this.setState({
        imageStyle: {
          maxWidth,
          width: maxWidth - _width < 30 ? maxWidth : _width,
          height: maxWidth - _width < 30 ? (_height * maxWidth / _width) : _height,
          marginLeft: (maxWidth - _width < 30) ? -CONTAINER_PADDING : 0
        }
      })
    }, () => console.log("Image GetSize Error"))
  }

  render() {
    const { imageStyle } = this.state;
    const { style } = this.props;
    return (
      <ImageProgress
        {...this.props}
        style={[imageStyle, style]}
        indicator={ActivityIndicator}
      />
    )
  }
}

export default class HtmlViewer extends PureComponent {
  static propTypes = {
    html: PropTypes.string,
    htmlWrapCssString: PropTypes.string,
    containerMaxWidth: PropTypes.number,
    containerStyle: ViewPropTypes.style
  };

  static defaultProps = {
    containerMaxWidth: SCREEN_WIDTH,
    containerStyle: {
      padding: CONTAINER_PADDING
    }
  };

  state = {
    imageSize: {}
  }

  _renderBlockQuote = (attr, children, convertedCSSStyles, passProps) => {
    return (
      <View key={passProps.key} style={styles.blockquote}>
        <Text style={styles.blockquoteText}>{children}</Text>
      </View>
    );
  };

  _renderImage = (attr, children, convertedCSSStyles, passProps) => {
    const { containerMaxWidth } = this.props;
    return (
      <ImageAutoSize
        source={{ uri: attr.src }}
        key={passProps.key}
        maxWidth={containerMaxWidth}
        width={!!attr.width ? Number(attr.width) : containerMaxWidth}
        height={!!attr.height ? Number(attr.height) : 0}
        style={styles.image}
      />
    );
  };

  _renderFigcaption = (attr, children, convertedCSSStyles, passProps) => {
    const { containerMaxWidth } = this.props;
    return (
      <View
        key={passProps.key}
        style={[
          styles.figcaption,
          {
            maxWidth: containerMaxWidth - CONTAINER_PADDING * 2,
            width: containerMaxWidth
          }
        ]}
      >
        <Text>{children}</Text>
      </View>
    );
  };

  render() {
    const {
      html,
      htmlWrapCssString,
      containerMaxWidth,
      containerStyle
    } = this.props;
    const _htmlWrapCssString =
      `
      font-size: 14px;
      line-height: 1.5em;
      text-align: justify;
      text-justify: inter-word;
      color: ${colorDark1};
    ` + htmlWrapCssString;
    return (
      <HTML
        {...this.props}
        html={`<div style="${_htmlWrapCssString}">${html}</div>`}
        imagesMaxWidth={containerMaxWidth}
        containerStyle={containerStyle}
        renderers={{
          blockquote: this._renderBlockQuote,
          img: this._renderImage,
          figcaption: this._renderFigcaption
        }}
        onLinkPress={(evt, href) => {
          DeepLinkingSocial(href);
        }}
        tagsStyles={tagsStyles}
      />
    );
  }
}

const tagsStyles = {
  a: {
    color: colorPrimary
  },
  h1: {
    marginBottom: 10,
    fontSize: 26,
    lineHeight: 30
  },
  h2: {
    marginBottom: 10,
    fontSize: 22,
    lineHeight: 28
  },
  h3: {
    marginBottom: 10,
    fontSize: 20,
    lineHeight: 24
  },
  h4: {
    marginBottom: 10,
    fontSize: 18,
    lineHeight: 22
  },
  h5: {
    marginBottom: 10,
    fontSize: 16,
    lineHeight: 20
  },
  h6: {
    marginBottom: 10,
    fontSize: 14,
    lineHeight: 18
  },
  ul: {
    marginLeft: -15,
    marginTop: 4
  },
  li: {
    marginTop: -2
  },
  figcaption: {
    fontSize: 12,
    fontStyle: "italic",
    opacity: 0.8,
    lineHeight: 18
  }
};

const styles = StyleSheet.create({
  blockquote: {
    borderLeftWidth: 2,
    borderLeftColor: colorPrimary,
    paddingLeft: 10,
    marginVertical: 10
  },
  blockquoteText: {
    opacity: 0.8,
    fontSize: 15
  },
  image: {
    marginVertical: 10
  },
  figcaption: {
    borderBottomWidth: 10,
    borderBottomColor: "transparent"
  },
  heading: {
    marginBottom: 10
  },
  headingText: {
    fontWeight: "bold"
  }
});

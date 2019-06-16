import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import {
  View,
  Text,
  TextInput,
  WebView,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  StatusBar
} from "react-native";
import { HeaderHasBack, Loader } from "../../wiloke-elements";
import { Constants } from "expo";
import { Feather } from "@expo/vector-icons";
import * as Consts from "../../constants/styleConstants";
import * as Progress from "react-native-progress";
import { MapView } from "expo";

const HEADER_HEIGHT = 36 + Constants.statusBarHeight;
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export default class WebViewScreen extends PureComponent {
  state = {
    text: "",
    url: "",
    isLoading: true
  };

  componentDidMount() {
    const { navigation } = this.props;
    const { params } = navigation.state;
    const { url } = params;
    this.setState({ url, text: url });
  }

  _handleLoadEnd = () => {
    this.setState({ isLoading: false });
  };

  _handleChangeText = text => {
    this.setState({ text });
  };

  renderTextInput = () => {
    const { url } = this.state;
    return (
      typeof url !== "object" &&
      url.search("google.com/maps") === -1 && (
        <View style={styles.inputWrapper}>
          <TextInput
            value={url}
            onChangeText={this._handleChangeText}
            underlineColorAndroid="transparent"
            autoCorrect={false}
            dataDetectorTypes="link"
            style={styles.input}
          />
        </View>
      )
    );
  };

  _handleReload = () => {
    const { text, url } = this.state;
    typeof url !== "object" &&
      this.setState({
        url: text.search(/^http/g) !== -1 ? text : `http://${text}`
      });
  };

  renderButtonReload = () => {
    const { url } = this.state;
    return (
      typeof url !== "object" &&
      url.search("google.com/maps") === -1 && (
        <TouchableOpacity activeOpacity={0.5} onPress={this._handleReload}>
          <Feather name="corner-up-right" size={20} color="#fff" />
        </TouchableOpacity>
      )
    );
  };

  render() {
    const { navigation } = this.props;
    const { params } = navigation.state;
    const { url, isLoading } = this.state;
    const { title, description, lat, lng } = url;
    return (
      <View
        style={{
          position: "relative",
          width: SCREEN_WIDTH,
          height: SCREEN_HEIGHT
        }}
      >
        <StatusBar barStyle="light-content" />
        <HeaderHasBack
          renderRight={this.renderButtonReload}
          renderCenter={this.renderTextInput}
          goBack={() => navigation.goBack()}
          headerHeight={36}
          headerBackgroundColor={Consts.colorDark1}
        />
        {typeof url !== "object" ? (
          <WebView
            ref={ref => (this._webView = ref)}
            source={{ uri: url }}
            onLoadEnd={this._handleLoadEnd}
            style={{
              width: SCREEN_WIDTH,
              height: SCREEN_HEIGHT - HEADER_HEIGHT,
              borderWidth: 10
            }}
          />
        ) : (
          <MapView
            style={{
              flex: 1,
              width: SCREEN_WIDTH,
              height: SCREEN_HEIGHT - HEADER_HEIGHT
            }}
            initialRegion={{
              latitude: Number(lat),
              longitude: Number(lng),
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421
            }}
          >
            <MapView.Marker
              coordinate={{
                latitude: Number(lat),
                longitude: Number(lng)
              }}
              title={title}
              description={description}
            />
          </MapView>
        )}
        {typeof url !== "object" && isLoading && (
          <View style={styles.loading}>
            <Loader size="small" />
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  inputWrapper: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 3
  },
  input: {
    color: Consts.colorGray1,
    paddingVertical: 3,
    paddingHorizontal: 8,
    width: "100%"
  },
  loading: {
    backgroundColor: "#fff",
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT - HEADER_HEIGHT,
    position: "absolute",
    top: HEADER_HEIGHT,
    left: 0,
    zIndex: 9
  }
});

import React, { PureComponent } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  StyleSheet
} from "react-native";
import PropTypes from "prop-types";
import * as Consts from "../../constants/styleConstants";
import stylesBase from "../../stylesBase";
import Heading from "./Heading";
import { ImageCover, IconTextSmall } from "../../wiloke-elements";

const { width } = Dimensions.get("window");
const ITEM_WIDTH = width / 1.3;

export default class ListingPopItem extends PureComponent {
  static propTypes = {
    onPress: PropTypes.func,
    image: PropTypes.string,
    logo: PropTypes.string,
    name: PropTypes.string,
    tagline: PropTypes.string,
    location: PropTypes.string,
    colorPrimary: PropTypes.string
  };
  static defaultProps = {
    contentLoader: false,
    onPress: () => {},
    colorPrimary: Consts.colorPrimary
  };
  renderLoader = () => <View style={styles.contentLoader} />;

  renderContent = () => (
    <TouchableOpacity activeOpacity={0.6} onPress={this.props.onPress}>
      <View style={styles.inner}>
        <View>
          <ImageCover
            src={this.props.image}
            width={ITEM_WIDTH}
            modifier="16by9"
            overlay={0.4}
            // linearGradient={["rgba(0, 107, 247, 1)", "rgba(237, 99, 146, 1)"]}
            styles={{
              borderRadius: Consts.round
            }}
          />
        </View>
        <View style={[stylesBase.pd10, styles.content]}>
          <View style={styles.logoWrap}>
            <ImageCover
              src={this.props.logo}
              width={30}
              styles={styles.logo}
              borderRadius={15}
            />
          </View>
          <Heading
            title={this.props.name}
            text={this.props.tagline}
            titleSize={13}
            textSize={11}
            titleNumberOfLines={1}
            textNumberOfLines={1}
          />
          <View style={{ marginRight: 20, marginTop: 2 }}>
            <IconTextSmall
              text={this.props.location}
              iconName="map-pin"
              textStyle={styles.metaText}
              numberOfLines={1}
              iconColor={this.props.colorPrimary}
            />
            {/* <View style={{ width: 10 }} />
            <IconTextSmall
              text={this.props.phone}
              iconName="phone"
              textStyle={styles.metaText}
            /> */}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
  render() {
    return (
      <View style={styles.container}>
        {!this.props.contentLoader ? this.renderContent() : this.renderLoader()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderRadius: Consts.round,
    overflow: "hidden",
    width: ITEM_WIDTH
  },
  inner: {
    position: "relative",
    zIndex: 9,
    paddingBottom: 60
  },
  logoWrap: {
    marginBottom: 8
  },
  content: {
    position: "absolute",
    left: 10,
    right: 10,
    bottom: 0,
    zIndex: 1,
    backgroundColor: "#fff",
    borderRadius: Consts.round
  },
  // metaText: {
  //   color: Consts.colorGray1
  // },
  contentLoader: {
    backgroundColor: Consts.colorGray1,
    borderRadius: Consts.round,
    width: ITEM_WIDTH,
    height: ITEM_WIDTH * (56.25 / 100)
  }
});

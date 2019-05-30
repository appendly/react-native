import React from "react";
import PropTypes from "prop-types";
import {
  View,
  Text,
  ImageBackground,
  Dimensions,
  StyleSheet
} from "react-native";
import { LinearGradient } from "expo";
import * as Consts from "../../constants/styleConstants";
import stylesBase from "../../stylesBase";
import { Overlay } from "../../wiloke-elements";

const { height } = Dimensions.get("window");

const Hero = props => {
  return (
    <View>
      <ImageBackground source={{ uri: props.src }} style={styles.background}>
        <Overlay opacity={1} backgroundColor={props.overlayColor} />
        <View style={styles.content}>
          <Text
            style={[stylesBase.h2, { color: props.titleColor }, styles.title]}
          >
            {props.title}
          </Text>
          <Text
            style={[stylesBase.text, { color: props.textColor }, styles.text]}
          >
            {props.text}
          </Text>
        </View>
      </ImageBackground>
    </View>
  );
};
Hero.propTypes = {
  titleColor: PropTypes.string,
  textColor: PropTypes.string,
  title: PropTypes.string,
  text: PropTypes.string,
  src: PropTypes.string,
  overlayColor: PropTypes.string
};
Hero.defaultProps = {
  titleColor: Consts.colorPrimary,
  textColor: Consts.colorGray1,
  overlayColor: "rgba(0,0,0,0.4)"
};

const styles = StyleSheet.create({
  background: {
    position: "relative",
    width: "100%",
    height: height / 3.5
  },
  content: {
    position: "relative",
    zIndex: 9,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20
  },
  title: {
    marginBottom: 5,
    textAlign: "center"
  },
  text: {
    textAlign: "center",
    fontSize: 15,
    lineHeight: 20
  }
});

export default Hero;

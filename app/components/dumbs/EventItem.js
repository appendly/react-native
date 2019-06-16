import React from "react";
import PropTypes from "prop-types";
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  ViewPropTypes
} from "react-native";
import * as Consts from "../../constants/styleConstants";
import stylesBase from "../../stylesBase";
import { ImageCover } from "../../wiloke-elements";
import Heading from "./Heading";

const EventItem = props => (
  <TouchableOpacity
    activeOpacity={0.6}
    onPress={props.onPress}
    style={[styles.container, props.style]}
  >
    <ImageCover
      src={props.image}
      width="100%"
      modifier="16by9"
      overlay={0.3}
      styles={{
        borderTopLeftRadius: Consts.round,
        borderTopRightRadius: Consts.round
      }}
    />
    <View style={[{ padding: 8 }, props.bodyStyle]}>
      <Heading
        title={props.name}
        text={props.date}
        titleSize={12}
        textSize={11}
        titleNumberOfLines={1}
        textNumberOfLines={1}
      />
      <Text
        style={{ fontSize: 10, color: Consts.colorDark3 }}
        numberOfLines={1}
      >
        {props.address}
      </Text>
      <View style={{ height: 4 }} />
      <Text
        style={{ fontSize: 10, color: Consts.colorDark3 }}
        numberOfLines={1}
      >
        {props.interested}
      </Text>
    </View>
    <View style={[styles.footer, props.footerStyle]}>
      <Text style={{ fontSize: 11, color: Consts.colorDark3 }}>
        {props.hosted}
      </Text>
    </View>
  </TouchableOpacity>
);

EventItem.propTypes = {
  image: PropTypes.string,
  name: PropTypes.string,
  date: PropTypes.string,
  address: PropTypes.string,
  hosted: PropTypes.string,
  interested: PropTypes.string,
  onPress: PropTypes.func,
  bodyStyle: ViewPropTypes.style,
  style: ViewPropTypes.style,
  footerStyle: ViewPropTypes.style
};

EventItem.defaultProps = {
  onPress: _ => {}
};

const styles = StyleSheet.create({
  container: {
    borderRadius: Consts.round,
    backgroundColor: "#fff",
    overflow: "hidden"
  },
  footer: {
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderTopWidth: 1,
    borderTopColor: Consts.colorGray2,
    flexDirection: "row",
    justifyContent: "space-between"
  }
});

export default EventItem;

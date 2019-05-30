import React from "react";
import PropTypes from "prop-types";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { ImageCover, H6, P } from "../../wiloke-elements";
import * as Consts from "../../constants/styleConstants";

const PostCard = props => {
  return (
    <View style={styles.container}>
      <TouchableOpacity activeOpacity={0.6} onPress={props.onPress}>
        <View style={styles.imageWrapper}>
          <ImageCover src={props.image} modifier="16by9" />
        </View>
        <View style={styles.body}>
          <H6 numberOfLines={1} style={{ fontSize: 13, marginBottom: 4 }}>
            {props.title}
          </H6>
          <P
            style={{ color: Consts.colorDark3, fontSize: 12 }}
            numberOfLines={1}
          >
            {props.text}
          </P>
          <View style={styles.meta}>{props.renderMeta()}</View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

PostCard.propTypes = {
  image: PropTypes.string,
  title: PropTypes.string,
  text: PropTypes.string,
  onPress: PropTypes.func,
  renderMeta: PropTypes.func
};

PostCard.defaultProps = {
  renderMeta: () => {},
  onPress: () => {}
};

const styles = StyleSheet.create({
  container: {
    borderRadius: Consts.round,
    overflow: "hidden",
    backgroundColor: "#fff"
  },
  imageWrapper: {
    backgroundColor: Consts.colorGray1
  },
  body: {
    padding: 8
  },
  meta: {}
});

export default PostCard;

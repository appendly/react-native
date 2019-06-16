import React, { Component } from "react";
import { Text, View, StyleSheet } from "react-native";
import ImageProgress from "react-native-image-progress";
import * as Consts from "../../../constants/styleConstants";

const NotifyItem = ({ imageSize }) => {
  return (
    <View style={styles.container}>
      <ImageProgress
        source={{ uri: image }}
        resizeMode="cover"
        style={[
          {
            width: imageSize,
            height: imageSize
          },
          styleImage
        ]}
        indicator={ActivityIndicator}
      />
      <View style={styles.content} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row"
  }
});

import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import * as Consts from "../../constants/styleConstants";
import {
  EventsContainer,
  LocationModalPickerContainer,
  NearbyContainer
} from "../smarts";
import { Layout } from "../dumbs";
import { connect } from "react-redux";

const EventScreen = props => {
  const { navigation, settings } = props;
  const { state } = navigation;
  const nextRoute = navigation.dangerouslyGetParent().state;
  const postType = state.params ? state.params.key : nextRoute.key;
  return (
    <Layout
      navigation={navigation}
      headerType="headerHasFilter"
      renderLeft={() => <NearbyContainer postType={postType} />}
      renderCenter={() => <LocationModalPickerContainer postType={postType} />}
      renderRight={() => (
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => navigation.navigate("SearchScreen")}
          style={{ width: 25, alignItems: "flex-end" }}
        >
          <Feather name="search" size={20} color="#fff" />
        </TouchableOpacity>
      )}
      renderContent={() => <EventsContainer navigation={navigation} />}
      scrollViewEnabled={false}
      scrollViewStyle={{
        backgroundColor: Consts.colorGray2
      }}
      colorPrimary={settings.colorPrimary}
    />
  );
};
const mapStateToProps = state => ({
  settings: state.settings
});
export default connect(mapStateToProps)(EventScreen);

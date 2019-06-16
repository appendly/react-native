import React from "react";
import { View, Text, Platform } from "react-native";
import { Layout } from "../dumbs";
import { MenuContainer } from "../smarts";
import { connect } from "react-redux";
import { Modal } from "../../wiloke-elements";
import { Feather } from "@expo/vector-icons";

const MenuScreen = props => {
  const { navigation, translations, settings, auth } = props;
  const { isLoggedIn } = auth;
  return (
    <Layout
      navigation={navigation}
      textSearch={translations.search}
      renderContent={() => <MenuContainer navigation={navigation} />}
      colorPrimary={settings.colorPrimary}
      isLoggedIn={isLoggedIn}
    />
  );
};
const mapStateToProps = state => ({
  settings: state.settings,
  translations: state.translations,
  auth: state.auth
});
export default connect(mapStateToProps)(MenuScreen);

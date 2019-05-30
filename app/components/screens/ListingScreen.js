import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import * as Consts from "../../constants/styleConstants";
import { withNavigationFocus, FlatListRedux } from "../../wiloke-elements";
import {
  ListingsContainer,
  LocationModalPickerContainer,
  NearbyContainer
} from "../smarts";
import { Layout } from "../dumbs";
import { connect } from "react-redux";

const Listing = props => {
  const { navigation, isFocused, settings } = props;
  const { state } = navigation;
  const nextRoute = navigation.dangerouslyGetParent().state;
  const postType = state.params ? state.params.key : nextRoute.key;
  return (
    <Layout
      navigation={navigation}
      headerType="headerHasFilter"
      renderLeft={() => <NearbyContainer postType={postType} />}
      renderCenter={() => (
        <LocationModalPickerContainer
          postType={postType}
          isFocused={isFocused}
        />
      )}
      renderRight={() => (
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => navigation.navigate("SearchScreen")}
          style={{ width: 25, alignItems: "flex-end" }}
        >
          <Feather name="search" size={20} color="#fff" />
        </TouchableOpacity>
      )}
      renderContent={() => <ListingsContainer navigation={navigation} />}
      // renderContent={() => {
      //   return (
      //     <FlatListRedux
      //       componentDidMount={() => {
      //         this.props.getListings();
      //       }}
      //       onEndReached={params => {
      //         this.props.getListingLoadmore(params)
      //       }}
      //       data={["test", "sdfsdf"]}
      //       keyExtractor={(item, index) => index.toString()}
      //       renderItem={({ item, index }) => {
      //         return <Text>{item}</Text>;
      //       }}
      //     />
      //   );
      // }}
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
export default connect(mapStateToProps)(withNavigationFocus(Listing));

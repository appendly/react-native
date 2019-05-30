import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { TouchableOpacity, ViewPropTypes } from "react-native";
import { IconTextMedium } from "../../wiloke-elements";
import * as Consts from "../../constants/styleConstants";
import { MapView } from "expo";

export class AddressItem extends PureComponent {
  _renderMap = () => {
    const { address, navigation } = this.props;
    const { name } = navigation.state.params;
    const lat = Number(address.lat);
    const lng = Number(address.lng);
    return (
      <MapView
        style={{
          width: "100%",
          height: "100%"
        }}
        initialRegion={{
          latitude: lat,
          longitude: lng,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421
        }}
        pointerEvents="none"
      >
        <MapView.Marker
          coordinate={{
            latitude: lat,
            longitude: lng
          }}
          title={name}
          description={address.address}
        />
      </MapView>
    );
  };
  render() {
    const {
      address,
      navigation,
      style,
      iconColor,
      iconBackgroundColor
    } = this.props;
    const { name } = navigation.state.params;
    const lat = Number(address.lat);
    const lng = Number(address.lng);
    return (
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={_ => {
          navigation.navigate("WebViewScreen", {
            url: {
              title: name,
              description: address.address,
              lat,
              lng
            }
          });
        }}
        style={style}
      >
        <IconTextMedium
          iconName="map-pin"
          iconSize={30}
          iconColor={iconColor}
          iconBackgroundColor={iconBackgroundColor}
          text={address.address}
          renderBoxLastText={this._renderMap}
        />
      </TouchableOpacity>
    );
  }
}
AddressItem.propTypes = {
  address: PropTypes.object,
  style: ViewPropTypes.style
};
AddressItem.defaultProps = {
  iconColor: "#fff",
  iconBackgroundColor: Consts.colorSecondary
};

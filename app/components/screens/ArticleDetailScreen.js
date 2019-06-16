import React, { PureComponent } from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import * as Consts from "../../constants/styleConstants";
import { ParallaxScreen, ActionSheet } from "../../wiloke-elements";
import { Feather } from "@expo/vector-icons";
import { ArticleDetailContainer } from "../smarts";
import { Heading } from "../dumbs";
import { connect } from "react-redux";

class EventDetailScreen extends PureComponent {
  renderHeaderLeft = () => {
    const { navigation } = this.props;
    return (
      <TouchableOpacity activeOpacity={0.5} onPress={() => navigation.goBack()}>
        <View
          style={{
            width: 30,
            height: 30,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Feather name="chevron-left" size={26} color="#fff" />
        </View>
      </TouchableOpacity>
    );
  };

  renderHeaderCenter = () => {
    const { navigation } = this.props;
    const { params } = navigation.state;
    return (
      <Text style={{ color: "#fff" }} numberOfLines={1}>
        {params.name}
      </Text>
    );
  };

  renderHeaderRight() {
    return (
      <ActionSheet
        options={["Cancel", "Remove", "Report", "Write a review"]}
        destructiveButtonIndex={1}
        cancelButtonIndex={0}
        onPressButtonItem={() => {
          console.log("press");
        }}
        renderButtonItem={() => (
          <View
            style={{
              width: 40,
              height: 40,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Feather name="more-horizontal" size={24} color="#fff" />
          </View>
        )}
        onAction={buttonIndex => {
          console.log(buttonIndex);
          if (buttonIndex === 1) {
            // code
          }
        }}
      />
    );
  }

  render() {
    const { navigation, settings } = this.props;
    const { params } = navigation.state;
    return (
      <ParallaxScreen
        headerImageSource={params.image}
        overlayRange={[0, 0.9]}
        overlayColor={settings.colorPrimary}
        renderHeaderLeft={this.renderHeaderLeft}
        renderHeaderCenter={this.renderHeaderCenter}
        renderHeaderRight={this.renderHeaderRight}
        renderContent={() => (
          <View style={{ padding: 10 }}>
            <Heading title={params.name} titleSize={18} textSize={12} />
            <View
              style={{
                marginHorizontal: -10,
                paddingHorizontal: 10,
                backgroundColor: Consts.colorGray2
              }}
            >
              <ArticleDetailContainer navigation={navigation} />
            </View>
          </View>
        )}
      />
    );
  }
}

const mapStateToProps = state => ({
  settings: state.settings
});

export default connect(mapStateToProps)(EventDetailScreen);

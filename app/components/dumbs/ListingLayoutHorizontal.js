import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  TouchableHighlight,
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet
} from "react-native";
import _ from "lodash";
import he from "he";
import ListingItem from "../dumbs/ListingItem";
import { Loader } from "../../wiloke-elements";
import * as Consts from "../../constants/styleConstants";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

class ListingLayoutHorizontal extends Component {
  static propTypes = {
    data: PropTypes.array,
    colorPrimary: PropTypes.string
  };

  static defaultProps = {
    colorPrimary: Consts.colorPrimary
  };

  renderItem = ({ item }) => {
    const { navigation } = this.props;
    return (
      <ListingItem
        image={item.oFeaturedImg.medium}
        title={he.decode(item.postTitle)}
        tagline={item.tagLine ? he.decode(item.tagLine) : null}
        logo={item.logo !== "" ? item.logo : item.oFeaturedImg.thumbnail}
        location={he.decode(item.oAddress.address)}
        reviewMode={item.oReview.mode}
        reviewAverage={item.oReview.average}
        businessStatus={item.businessStatus}
        colorPrimary={this.props.colorPrimary}
        onPress={() =>
          navigation.navigate("ListingDetailScreen", {
            id: item.ID,
            name: he.decode(item.postTitle),
            tagline: !!item.tagLine ? he.decode(item.tagLine) : null,
            link: item.postLink,
            author: item.oAuthor,
            image:
              SCREEN_WIDTH > 420
                ? item.oFeaturedImg.large
                : item.oFeaturedImg.medium,
            logo: item.logo !== "" ? item.logo : item.oFeaturedImg.thumbnail
          })
        }
        layout={this.props.layout}
      />
    );
  };
  renderItemLoader = () => (
    <ListingItem contentLoader={true} layout={this.props.layout} />
  );

  render() {
    const { data } = this.props;
    return (
      <View style={styles.container}>
        {data.length > 0 ? (
          <FlatList
            data={data}
            renderItem={this.renderItem}
            keyExtractor={item => item.ID.toString()}
            numColumns={this.props.layout === "horizontal" ? 1 : 2}
            horizontal={this.props.layout === "horizontal" ? true : false}
            showsHorizontalScrollIndicator={false}
          />
        ) : (
          <FlatList
            data={[
              { key: "1" },
              { key: "2" },
              { key: "3" },
              { key: "4" },
              { key: "5" },
              { key: "6" }
            ]}
            renderItem={this.renderItemLoader}
            numColumns={1}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    padding: 5
  }
});

export default ListingLayoutHorizontal;

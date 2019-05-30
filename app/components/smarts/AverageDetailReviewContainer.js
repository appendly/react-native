import React, { Component } from "react";
import PropTypes from "prop-types";
import { View, Text } from "react-native";
import { Rated, RatedSmall } from "../dumbs";
import { connect } from "react-redux";
import {
  isEmpty,
  Loader,
  ContentBox,
  ViewWithLoading
} from "../../wiloke-elements";
import * as Consts from "../../constants/styleConstants";

class AverageDetailReviewContainer extends Component {
  renderItem = (mode, len) => (item, index) => {
    return (
      <RatedSmall
        key={index.toString()}
        max={mode}
        rate={item.average}
        text={item.text}
        horizontal={true}
        style={{
          borderTopWidth: 1,
          borderTopColor: Consts.colorGray1,
          paddingTop: 10,
          paddingBottom: index === len - 1 ? 0 : 10,
          paddingHorizontal: 10,
          marginHorizontal: -10
        }}
      />
    );
  };
  renderAverageReviews = () => {
    const { listingReviews } = this.props;
    const { oAverageDetailsReview, mode } = listingReviews;
    return oAverageDetailsReview.map(
      this.renderItem(mode, oAverageDetailsReview.length)
    );
  };
  renderAverageTotal = () => {
    const { listingReviews } = this.props;
    const { mode, average, quality } = listingReviews;
    return (
      <View style={{ marginBottom: 10 }}>
        <Rated max={mode} rate={average} text={quality} />
      </View>
    );
  };
  render() {
    const {
      translations,
      listingReviews,
      loadingReview,
      settings
    } = this.props;
    return (
      <ViewWithLoading isLoading={loadingReview} contentLoader="contentHeader">
        {!isEmpty(listingReviews) && (
          <ContentBox
            headerIcon="star"
            headerTitle={translations.averageRating}
            style={{ marginBottom: 10 }}
            colorPrimary={settings.colorPrimary}
          >
            <View>
              {this.renderAverageTotal()}
              {this.renderAverageReviews()}
            </View>
          </ContentBox>
        )}
      </ViewWithLoading>
    );
  }
}

const mapStateToProps = state => ({
  listingReviews: state.listingReviews,
  loadingReview: state.loadingReview,
  translations: state.translations,
  settings: state.settings
});

export default connect(mapStateToProps)(AverageDetailReviewContainer);

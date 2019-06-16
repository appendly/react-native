import React, { PureComponent } from "react";
import { Text, View, Dimensions } from "react-native";
import { ReviewForm, Layout } from "../dumbs";
import { connect } from "react-redux";
import { colorGray2, colorDark1 } from "../../constants/styleConstants";
import {
  Button,
  bottomBarHeight,
  toDataURL,
  Loader
} from "../../wiloke-elements";
import { Constants } from "expo";
import { submitReview, getReviewFields } from "../../actions";
import { ImageManipulator, FileSystem } from "expo";
import _ from "lodash";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const HEADER_HEIGHT = 52 + Constants.statusBarHeight;
const CONTENT_HEIGHT = SCREEN_HEIGHT - HEADER_HEIGHT - 50 - bottomBarHeight;

class ReviewFormScreen extends PureComponent {
  state = {
    isScrollEnabled: true,
    isSubmitLoading: false,
    formResults: {},
    isLoading: true
  };

  componentDidMount() {
    const { navigation } = this.props;
    const { params } = navigation.state;
    this.props.getReviewFields(params.id);
    this.setState({ isLoading: false });
  }

  _handleRangeSliderBeginChangeValue = () => {
    this.setState({
      isScrollEnabled: false
    });
  };

  _handleSubmitReview = async () => {
    try {
      this.setState({ isSubmitLoading: true });
      const { formResults } = this.state;
      console.log(formResults);
      const { gallery } = formResults;
      if (!gallery) {
        this.props.submitReview(formResults);
        this.setState({ isSubmitLoading: false });
        return;
      }
      const galleryPromise = gallery.map(uri => {
        return ImageManipulator.manipulate(uri, [{ resize: { width: 1000 } }], {
          base64: false
        });
      });
      const newGalleryUri = await Promise.all(galleryPromise);
      const newGallery = newGalleryUri.map(item => ({
        uri: item.uri,
        name: item.uri.replace(/^.*\//g, ""),
        type: `image/${item.uri.replace(/^.*\./g, "")}`
      }));
      // const galleryUriBase64 = galleryBase64.map(
      //   item => `data:image/jpeg;base64,${item.base64}`
      // );
      const newFormResults = { ...formResults, gallery: newGallery };
      this.setState({ isSubmitLoading: false });
      this.props.submitReview(newFormResults);
    } catch (err) {
      console.log(err);
    }
  };

  renderAfterContent = () => (
    <Button
      size="lg"
      block={true}
      backgroundColor="secondary"
      style={{
        paddingVertical: 0,
        height: 50,
        justifyContent: "center"
      }}
      isLoading={this.state.isSubmitLoading}
      onPress={this._handleSubmitReview}
    >
      {"Review"}
    </Button>
  );
  renderContent = () => {
    const { settings, translations, navigation, reviewFields } = this.props;
    const { params } = navigation.state;
    const { isLoading } = this.state;
    if (isLoading)
      return (
        <View style={{ height: 200 }}>
          <Loader size="small" />
        </View>
      );
    return (
      !_.isEmpty(reviewFields) && (
        <ReviewForm
          data={reviewFields}
          style={{ padding: 10 }}
          onRangeSliderBeginChangeValue={
            this._handleRangeSliderBeginChangeValue
          }
          settings={settings}
          translations={translations}
          mode={params.mode}
          onResults={results => {
            this.setState({
              formResults: results
            });
          }}
        />
      )
    );
  };
  render() {
    const { navigation, translations, auth } = this.props;
    const { isLoggedIn } = auth;
    return (
      <Layout
        navigation={navigation}
        headerType="headerHasBack"
        title={translations.yourReview}
        goBack={() => navigation.goBack()}
        renderContent={this.renderContent}
        renderAfterContent={this.renderAfterContent}
        isLoggedIn={isLoggedIn}
        scrollViewStyle={{
          backgroundColor: "#fff"
        }}
        tintColor={colorDark1}
        colorPrimary={colorGray2}
        statusBarStyle="dark-content"
        scrollEnabled={this.state.isScrollEnabled}
        contentHeight={CONTENT_HEIGHT}
      />
    );
  }
}

const mapStateFromProps = state => ({
  translations: state.translations,
  settings: state.settings,
  auth: state.auth,
  reviewFields: state.reviewFields
});

const mapDispatchFromProps = {
  submitReview,
  getReviewFields
};

export default connect(
  mapStateFromProps,
  mapDispatchFromProps
)(ReviewFormScreen);

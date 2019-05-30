import React, { PureComponent } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Share,
  Platform,
  Alert
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { connect } from "react-redux";
import * as Consts from "../../constants/styleConstants";
import {
  ActionSheet,
  Row,
  Col,
  Modal,
  bottomBarHeight,
  P,
  InputMaterial,
  ModalPicker,
  Toast,
  Button,
  Loader
} from "../../wiloke-elements";
import { ParallaxListingScreen } from "../dumbs";
import {
  ListingDescriptionContainer,
  ListingListFeatureContainer,
  ListingPhotosContainer,
  ListingReviewsContainer,
  ListingDetailNavContainer,
  ListingEventsContainer,
  ListingVideosContainer,
  ListingSidebarContainer,
  AverageDetailReviewContainer
} from "../smarts";
import {
  getListingDetail,
  addMyFavorites,
  getReportForm,
  postReport,
  getKeyFirebase,
  resetListingDetail,
  messageChatActive
} from "../../actions";
import _ from "lodash";

class ListingDetailScreen extends PureComponent {
  state = {
    isReviews: true,
    isVisibleReport: false,
    report: {},
    isLoadingReport: true
  };
  async componentDidMount() {
    const { navigation, getListingDetail } = this.props;
    const { params } = navigation.state;
    await getListingDetail(params.id);
    const { listingDetail } = this.props;
    this.setState({
      isReviews:
        typeof listingDetail.oHomeSections !== "undefined" &&
        Object.keys(listingDetail.oHomeSections).length > 0 &&
        Object.keys(listingDetail.oHomeSections).filter(
          item => listingDetail.oHomeSections[item].category === "reviews"
        ).length > 0
    });
  }

  componentDidUpdate() {
    const { scrollTo } = this.props;
    setTimeout(
      () =>
        this._scrollView
          .getNode()
          .scrollTo({ x: 0, y: scrollTo, animated: false }),
      1
    );
  }

  componentWillUnmount() {
    this.props.resetListingDetail();
  }

  _hide = key => {
    if (key) {
      return {};
    }
    return {
      opacity: 0,
      display: "none"
      // position: "absolute",
      // bottom: "100%",
      // zIndex: -999
    };
  };

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

  _handleWriteReview = () => {
    const { auth, navigation, listingDetail } = this.props;
    const { isReviews } = this.state;
    const { isLoggedIn } = auth;
    const { params } = navigation.state;
    if (isReviews) {
      isLoggedIn
        ? navigation.navigate("ReviewFormScreen", {
            mode: listingDetail.oReview.mode,
            id: params.id
          })
        : this._handleAccountScreen();
    }
  };

  _handleReportForm = async () => {
    this.setState({ isVisibleReport: true });
    await this.props.getReportForm();
    this.setState({ isLoadingReport: false });
  };

  _handleReportFormBackdropPress = () => {
    this.setState({ isVisibleReport: false });
  };

  _handlePostReport = id => async () => {
    await this.props.postReport(id, this.state.report);
    setTimeout(() => {
      this._toast.show(this.props.reportMessage, 3000);
    }, 500);
  };

  _actionSheetMoreOptions = () => {
    const { translations, auth } = this.props;
    const { isLoggedIn } = auth;
    return {
      // options: ["Cancel", "Remove", "Report", "Write a review"],
      options: [
        translations.cancel,
        translations.inbox,
        translations.share,
        // "Write a review",
        translations.report
      ],
      destructiveButtonIndex: 3,
      cancelButtonIndex: 0,
      onAction: buttonIndex => {
        switch (buttonIndex) {
          case 1:
            isLoggedIn ? this._handleInbox() : this._handleAccountScreen();
            break;
          case 2:
            this._handleShare();
            break;
          case 3:
            this._handleWriteReview();
            break;
          case 4:
            this._handleReportForm();
            break;
          default:
            break;
        }
      }
    };
  };

  renderHeaderRight = () => {
    return (
      <ActionSheet
        {...this._actionSheetMoreOptions()}
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
      />
    );
  };

  _handleShare = () => {
    const { navigation } = this.props;
    const { link } = navigation.state.params;
    Share.share(
      {
        ...Platform.select({
          ios: {
            message: "",
            url: link
          },
          android: {
            message: link
          }
        })
        // title: "Wow, did you see that?"
      }
      // {
      //   ...Platform.select({
      //     ios: {
      //       // iOS only:
      //       excludedActivityTypes: ["com.apple.UIKit.activity.PostToTwitter"]
      //     },
      //     android: {
      //       // Android only:
      //       dialogTitle: "Share : " + "this.props.title"
      //     }
      //   })
      // }
    );
  };

  _handleInbox = async () => {
    const {
      navigation,
      getKeyFirebase,
      shortProfile,
      messageChatActive
    } = this.props;
    const { params } = navigation.state;
    const { author } = params;
    const { ID: userID, displayName } = author;
    const myID = shortProfile.userID;
    if (myID.toString() !== userID.toString()) {
      await getKeyFirebase(myID, userID);
      const { keyFirebase } = this.props;
      !!keyFirebase && messageChatActive(myID, keyFirebase, true);
      navigation.navigate("SendMessageScreen", {
        userID,
        displayName,
        key: keyFirebase
      });
    }
  };

  _handleAddFavorite = () => {
    const { navigation, addMyFavorites } = this.props;
    const { id } = navigation.state.params;
    addMyFavorites(id);
  };

  _renderReportFormItem = item => {
    const { settings, translations } = this.props;
    switch (item.type) {
      case "text":
        return (
          <InputMaterial
            key={item.key}
            placeholder={item.label}
            colorPrimary={settings.colorPrimary}
            onChangeText={text => {
              this.setState({
                report: {
                  ...this.state.report,
                  [item.key]: text
                }
              });
            }}
          />
        );
      case "select":
        return (
          <ModalPicker
            key={item.key}
            label={item.label}
            options={item.options}
            cancelText={translations.cancel}
            matterial={true}
            colorPrimary={settings.colorPrimary}
            onChangeOptions={(name, isChecked) => {
              this.setState({
                report: {
                  ...this.state.report,
                  [item.key]: isChecked.length > 0 ? isChecked[0].id : ""
                }
              });
            }}
          />
        );
      case "textarea":
        return (
          <InputMaterial
            key={item.key}
            placeholder={item.label}
            multiline={true}
            numberOfLines={4}
            colorPrimary={settings.colorPrimary}
            onChangeText={text => {
              this.setState({
                report: {
                  ...this.state.report,
                  [item.key]: text
                }
              });
            }}
          />
        );
      default:
        return false;
    }
  };

  _handleAccountScreen = () => {
    const { translations, navigation } = this.props;
    Alert.alert(translations.login, translations.requiredLogin, [
      {
        text: translations.cancel,
        style: "cancel"
      },
      {
        text: translations.continue,
        onPress: () => navigation.navigate("AccountScreen")
      }
    ]);
  };

  renderActions = () => {
    const {
      navigation,
      listIdPostFavorites,
      listIdPostFavoritesRemoved,
      settings,
      translations,
      reportForm,
      listingDetail,
      auth
    } = this.props;
    const { isLoggedIn } = auth;
    const { id } = navigation.state.params;
    const listIdPostFavoritesFilter = listIdPostFavorites.filter(
      item => item.id === id
    );
    const isListingFavorite =
      !_.isEmpty(listingDetail) && listingDetail.oFavorite.isMyFavorite;
    const condition =
      listIdPostFavoritesFilter.length > 0 ||
      (listIdPostFavoritesFilter.length > 0 &&
        !_.isEmpty(listingDetail) &&
        isListingFavorite) ||
      (listIdPostFavoritesRemoved.length === 0 && isListingFavorite);
    return (
      <View
        style={{
          borderTopWidth: 1,
          borderBottomWidth: 1,
          borderColor: Consts.colorGray1,
          paddingVertical: 15,
          paddingBottom: 15,
          backgroundColor: "#fff",
          marginBottom: 10,
          marginTop: -10,
          marginHorizontal: -10
        }}
      >
        <Row>
          <Col column={4}>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={
                isLoggedIn ? this._handleAddFavorite : this._handleAccountScreen
              }
              style={{
                flexDirection: "column",
                alignItems: "center"
              }}
            >
              <Feather
                name="heart"
                size={22}
                color={condition ? Consts.colorQuaternary : Consts.colorDark3}
              />
              <View style={{ height: 4 }} />
              <Text
                style={{
                  color: condition ? Consts.colorQuaternary : Consts.colorDark2,
                  fontSize: 12
                }}
              >
                {translations.favorite}
              </Text>
            </TouchableOpacity>
          </Col>
          <Col column={4}>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={this._handleShare}
              style={{
                flexDirection: "column",
                alignItems: "center"
              }}
            >
              <Feather name="share" size={22} color={Consts.colorDark3} />
              <View style={{ height: 4 }} />
              <Text style={{ color: Consts.colorDark2, fontSize: 12 }}>
                {translations.share}
              </Text>
            </TouchableOpacity>
          </Col>
          <Col column={4}>
            <Modal
              isVisible={this.state.isVisibleReport}
              headerIcon="alert-triangle"
              headerTitle={translations.report}
              colorPrimary={settings.colorPrimary}
              cancelText={translations.cancel}
              submitText={translations.submit}
              onBackdropPress={this._handleReportFormBackdropPress}
              renderButtonTextToggle={() => (
                <View
                  style={{
                    flexDirection: "column",
                    alignItems: "center"
                  }}
                >
                  <Feather
                    name="alert-triangle"
                    size={22}
                    color={Consts.colorDark3}
                  />
                  <View style={{ height: 4 }} />
                  <Text style={{ color: Consts.colorDark2, fontSize: 12 }}>
                    {translations.report}
                  </Text>
                </View>
              )}
              onButtonTextToggle={this._handleReportForm}
              onSubmitAsync={this._handlePostReport(id)}
            >
              {this.state.isLoadingReport ? (
                <View style={{ height: 100 }}>
                  <Loader size="small" height={100} />
                </View>
              ) : (
                <View>
                  {!_.isEmpty(reportForm) && (
                    <View>
                      <P>{reportForm.description}</P>
                      {!_.isEmpty(reportForm.aFields) &&
                        reportForm.aFields.map(this._renderReportFormItem)}
                    </View>
                  )}
                </View>
              )}
            </Modal>
          </Col>
          <Col column={4}>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={
                isLoggedIn ? this._handleInbox : this._handleAccountScreen
              }
              style={{
                flexDirection: "column",
                alignItems: "center"
              }}
            >
              <Feather
                name="message-square"
                size={22}
                color={Consts.colorDark3}
              />
              <View style={{ height: 4 }} />
              <Text style={{ color: Consts.colorDark2, fontSize: 12 }}>
                {translations.inbox}
              </Text>
            </TouchableOpacity>
          </Col>
        </Row>
      </View>
    );
  };

  renderDescription = type => (id, item, max) => (
    <ListingDescriptionContainer
      key={item.key}
      params={{ id, item, max }}
      type={type}
    />
  );

  renderListFeatures = type => (id, item, max) => (
    <ListingListFeatureContainer
      key={item.key}
      params={{ id, item, max }}
      type={type}
    />
  );

  renderPhotos = type => (id, item, max) => (
    <ListingPhotosContainer
      key={item.key}
      params={{ id, item, max }}
      type={type}
    />
  );

  renderReviews = type => (id, item, max) => {
    const { navigation, settings, listingDetail } = this.props;
    const { isReviews } = this.state;
    const isAverage =
      !_.isEmpty(listingDetail.oReview) && listingDetail.oReview.average !== 0;
    return (
      <View key={item.key}>
        {isReviews && isAverage && type !== null && this.renderAverageRating()}

        {/* <View style={{ marginBottom: 10 }}>
          <Button
            size="lg"
            block={true}
            backgroundColor="primary"
            radius="round"
            style={{
              paddingVertical: 0,
              height: 50,
              justifyContent: "center"
            }}
            onPress={this._handleWriteReview}
            colorPrimary={settings.colorPrimary}
          >
            Write a review
          </Button>
        </View> */}
        <ListingReviewsContainer
          navigation={navigation}
          params={{ id, item, max }}
          type={type}
          colorPrimary={settings.colorPrimary}
        />
      </View>
    );
  };

  renderEvents = type => (id, item, max) => {
    const { navigation } = this.props;
    return (
      <ListingEventsContainer
        key={item.key}
        navigation={navigation}
        params={{ id, item, max }}
        type={type}
      />
    );
  };

  renderVideos = type => (id, item, max) => (
    <ListingVideosContainer
      key={item.key}
      params={{ id, item, max }}
      type={type}
    />
  );

  _checkRenderDetailBox = (id, item, index) => {
    const { category, maximumItemsOnHome: max } = item;
    switch (category) {
      case "content":
      case "text":
        return this.renderDescription(null)(id, item, max);
      case "tags":
      case "boxIcon":
        return this.renderListFeatures(null)(id, item, max);
      case "photos":
        return this.renderPhotos(null)(id, item, max);
      case "reviews":
        return this.renderReviews(null)(id, item, max);
      case "events":
        return this.renderEvents(null)(id, item, max);
      case "videos":
        return this.renderVideos(null)(id, item, max);
      default:
        return false;
    }
  };

  _checkRenderTabContent = (item, index) => {
    const { navigation } = this.props;
    const { params } = navigation.state;
    const { id } = params;
    switch (item.category) {
      case "home":
        return this.renderDetailHomeContent();
      case "content":
      case "text":
        return this.renderDescription("all")(id, item, null);
      case "tags":
      case "boxIcon":
        return this.renderListFeatures("all")(id, item, null);
      case "photos":
        return this.renderPhotos("all")(id, item, null);
      case "reviews":
        return this.renderReviews("all")(id, item, null);
      case "videos":
        return this.renderVideos("all")(id, item, null);
      case "events":
        return this.renderEvents("all")(id, item, null);
      default:
        return false;
    }
  };

  renderAverageRating = () => {
    return <AverageDetailReviewContainer />;
  };

  renderDetailHomeContent = () => {
    const { navigation, listingDetail, settings } = this.props;
    const { params } = navigation.state;
    const { id } = params;
    const { isReviews } = this.state;
    const isAverage =
      !_.isEmpty(listingDetail.oReview) && listingDetail.oReview.average !== 0;
    return (
      <View>
        {isReviews && isAverage && this.renderAverageRating()}
        {settings.oSingleListing.contentPosition === "above_sidebar" && (
          <ListingSidebarContainer
            listingId={params.id}
            navigation={navigation}
          />
        )}
        {typeof listingDetail.oHomeSections !== "undefined" &&
          Object.keys(listingDetail.oHomeSections).length > 0 &&
          Object.keys(listingDetail.oHomeSections).map((item, index) => {
            const _item = listingDetail.oHomeSections[item];
            return this._checkRenderDetailBox(id, _item, index);
          })}
        {settings.oSingleListing.contentPosition !== "above_sidebar" && (
          <ListingSidebarContainer
            listingId={params.id}
            navigation={navigation}
          />
        )}
      </View>
    );
  };

  renderContent = () => {
    const { listingDetailNav } = this.props;
    return (
      <View
        style={{
          padding: 10,
          backgroundColor: Consts.colorGray2,
          marginBottom: bottomBarHeight
        }}
      >
        {this.renderActions()}
        <Toast ref={c => (this._toast = c)} />

        {listingDetailNav.length > 0 &&
          listingDetailNav.map((item, index) => (
            <View
              key={index.toString()}
              style={this._hide(item.current && true)}
            >
              {this._checkRenderTabContent(item, index)}
            </View>
          ))}
      </View>
    );
  };

  renderNavigation = () => {
    const { navigation, translations, listingDetail, settings } = this.props;
    const { params } = navigation.state;
    const itemFirst = [
      {
        name: translations.home,
        category: "home",
        key: "home",
        icon: "home",
        current: true,
        loaded: true
      }
    ];
    const navArr =
      typeof listingDetail.oNavigation !== "undefined"
        ? Object.values(listingDetail.oNavigation).map(item => ({
            name: item.name,
            category: item.category,
            key: item.key,
            icon: item.icon,
            current: false,
            loaded: false
          }))
        : [];
    const newData = [...itemFirst, ...navArr];
    return (
      <ListingDetailNavContainer
        data={newData}
        listingId={params.id}
        colorPrimary={settings.colorPrimary}
      />
    );
  };

  render() {
    const { navigation, settings } = this.props;
    const { params } = navigation.state;
    return (
      <ParallaxListingScreen
        scrollViewRef={ref => (this._scrollView = ref)}
        headerImageSource={params.image}
        logo={params.logo}
        title={params.name}
        tagline={!!params.tagline ? params.tagline : null}
        renderNavigation={this.renderNavigation}
        overlayRange={[0, 1]}
        overlayColor={settings.colorPrimary}
        renderHeaderLeft={this.renderHeaderLeft}
        renderHeaderCenter={this.renderHeaderCenter}
        renderHeaderRight={this.renderHeaderRight}
        renderContent={this.renderContent}
        navigation={navigation}
      />
    );
  }
}

const mapStateToProps = state => ({
  listingDetailNav: state.listingDetailNav,
  listingDetail: state.listingDetail,
  translations: state.translations,
  scrollTo: state.scrollTo,
  settings: state.settings,
  listIdPostFavorites: state.listIdPostFavorites,
  listIdPostFavoritesRemoved: state.listIdPostFavoritesRemoved,
  reportForm: state.reportForm,
  auth: state.auth,
  reportMessage: state.reportMessage,
  shortProfile: state.shortProfile,
  keyFirebase: state.keyFirebase
});

const mapDispatchToProps = {
  getListingDetail,
  addMyFavorites,
  getReportForm,
  postReport,
  getKeyFirebase,
  resetListingDetail,
  messageChatActive
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ListingDetailScreen);

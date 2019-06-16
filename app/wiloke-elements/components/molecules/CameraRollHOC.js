import React, { Component } from "react";
import PropTypes from "prop-types";
import { CameraRoll } from "react-native";
import _ from "lodash";

const CameraRollHOC = WrappedComponent => {
  return class extends Component {
    static propTypes = {
      firstItems: PropTypes.number, // số lượng ảnh hiển thị lúc đầu
      nextItems: PropTypes.number // số lượng ảnh thêm vào khi loadmore
    };

    static defaultProps = {
      firstItems: 20,
      nextItems: 20
    };

    state = {
      photos: [],
      has_next_page: true,
      after: null,
      startLoadmore: false
    };

    componentDidMount() {
      this._getPhotos();
    }

    shouldComponentUpdate(nextState) {
      if (!_.isEqual(nextState.photos, this.state.photos)) {
        return true;
      }
      return false;
    }

    // lấy ảnh lúc bắt đầu
    _getPhotos = async () => {
      try {
        const { firstItems } = this.props;
        const params = {
          first: firstItems,
          assetType: "Photos"
        };
        const r = await CameraRoll.getPhotos(params);
        const photos = r.edges;
        const { has_next_page, end_cursor } = r.page_info;
        this.setState({
          photos,
          has_next_page,
          after: end_cursor,
          startLoadmore: true
        });
      } catch (err) {
        console.log(err);
      }
    };

    // lúc kéo xuống cuối và load thêm ảnh
    _handleEndReached = async () => {
      const { after, startLoadmore } = this.state;
      const { nextItems } = this.props;
      if (startLoadmore) {
        const params = {
          first: nextItems,
          assetType: "Photos",
          ...(!!after ? { after } : {})
        };
        if (!this.state.has_next_page) return;
        const r = await CameraRoll.getPhotos(params);
        const { has_next_page, end_cursor } = r.page_info;
        this.setState(prevState => ({
          photos: [...prevState.photos, ...r.edges],
          has_next_page,
          after: end_cursor
        }));
      }
    };

    render() {
      const { photos } = this.state;
      return (
        <WrappedComponent
          data={photos}
          onEndReached={this._handleEndReached}
          {...this.props}
        />
      );
    }
  };
};

export default CameraRollHOC;

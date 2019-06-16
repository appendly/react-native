import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { View, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import * as Consts from "../../constants/styleConstants";
import { Row, Col, IconTextMedium } from "../../wiloke-elements";
import he from "he";

export default class ListingTagList extends PureComponent {
  static propTypes = {
    data: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string
      })
    )
  };

  render() {
    const { data } = this.props;
    return (
      <Row gap={15}>
        {data.length > 0 &&
          data.map((item, index) => (
            <Col key={item.term_id.toString()} column={2} gap={15}>
              <IconTextMedium
                iconName={item.icon}
                iconSize={30}
                text={he.decode(item.name)}
                texNumberOfLines={1}
              />
            </Col>
          ))}
      </Row>
    );
  }
}

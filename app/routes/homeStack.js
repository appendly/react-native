import { createStackNavigator } from "react-navigation";
import { Dimensions } from "react-native";
import stackOpts from "./stackOpts";
import HomeScreen from "../components/screens/HomeScreen";
import ListingCategories from "../components/screens/ListingCategories";
const { width } = Dimensions.get("window");
const homeStack = createStackNavigator(
  {
    HomeScreen: {
      screen: HomeScreen
    },
    ListingCategories: {
      screen: ListingCategories,
      navigationOptions: ({ navigation }) => ({
        gesturesEnabled: true,
        gestureResponseDistance: {
          horizontal: width
        }
      })
    }
  },
  stackOpts
);

export default homeStack;

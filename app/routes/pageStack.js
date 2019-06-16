import { createStackNavigator } from "react-navigation";
import stackOpts from "./stackOpts";
import PageScreen from "../components/screens/PageScreen";

const pageStack = createStackNavigator(
  {
    PageScreen: {
      screen: PageScreen
    }
  },
  stackOpts
);

export default pageStack;

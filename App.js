import React from "react";
import { YellowBox } from "react-native";
YellowBox.ignoreWarnings([
  "Warning: componentWillMount is deprecated",
  "Warning: componentWillReceiveProps is deprecated",
  "Remote debugger is in a background tab which",
  "Debugger and device times have drifted",
  "Warning: isMounted(...) is deprecated",
  "Setting a timer"
]);

import { AppLoading } from "expo";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/lib/integration/react";
import { store, persistor } from "./configureStore";
import { configureApp } from "./configureApp";
import RootStack from "./app/routes";
import axios from "axios";

import { updateFocus } from "./app/wiloke-elements";

axios.defaults.baseURL = `${configureApp.api.baseUrl.replace(
  /\/$/g,
  ""
)}/wp-json/wiloke/v2`;
axios.defaults.timeout = configureApp.api.timeout;

const App = () => {
  return (
    <PersistGate loading={<AppLoading />} persistor={persistor}>
      <Provider store={store}>
        <RootStack
          onNavigationStateChange={(prevState, currentState) => {
            updateFocus(currentState);
          }}
        />
      </Provider>
    </PersistGate>
  );
};
export default App;

import { createStore, applyMiddleware, compose } from "redux";
import logger from "redux-logger";
import thunk from "redux-thunk";
import rootReducers from "./app/reducers";
import storage from "redux-persist/lib/storage";
import { persistStore, persistReducer } from "redux-persist";
const persistConfig = {
  key: "root",
  storage,
  whitelist: [
    "translations",
    "settings",
    "auth",
    "countNotify",
    "countNotifyRealTimeFaker",
    "homeScreen",
    "listings",
    "events",
    "stackNavigator",
    "tabNavigator",
    "deviceToken"
  ]
};

const reducers = persistReducer(persistConfig, rootReducers);
const middlewares = [thunk];
// if (__DEV__) middlewares.push(logger);

const store = createStore(
  reducers,
  undefined,
  compose(applyMiddleware(...middlewares))
);
const persistor = persistStore(store);

export { store, persistor };

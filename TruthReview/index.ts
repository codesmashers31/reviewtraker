import { registerRootComponent } from 'expo';
import { configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated';
import './src/global.css';

import App from './App';

// Suppress Reanimated strict mode warnings (caused by third-party packages like NativeWind/css-interop)
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);

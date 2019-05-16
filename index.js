import { AppRegistry } from 'react-native';
import App from './App';
import Page from './src/components/Page/Page'
AppRegistry.registerComponent('App', () => App);
import { YellowBox } from 'react-native'
//YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated'])
console.disableYellowBox = true;
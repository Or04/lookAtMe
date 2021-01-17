import { createStackNavigator } from 'react-navigation-stack'
import {createAppContainer} from 'react-navigation'





import HomePageScreen from '../screens/Consumer/HomePageScreen'
import SearchAdvertisementsScreen from '../screens/Consumer/SearchAdvertisementsScreen'
import SelectDigitalBoardScreen from '../screens/Consumer/SelectDigitalBoardScreen'
import ShowDigitalBoardOnMapScreen from '../screens/Consumer/ShowDigitalBoardOnMapScreen'
import ShowAdvertisementsScreen from '../screens/Consumer/ShowAdvertisementsScreen'



const ConsumerNavigator = createStackNavigator({
    HomePage:HomePageScreen,
    SearchAdvertisements:SearchAdvertisementsScreen,
    SelectDigitalBoard:SelectDigitalBoardScreen,
    ShowDigitalBoardOnMap:ShowDigitalBoardOnMapScreen,
    ShowAdvertisements:ShowAdvertisementsScreen
});



export default createAppContainer(ConsumerNavigator)
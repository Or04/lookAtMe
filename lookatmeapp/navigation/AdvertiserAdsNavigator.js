import { createStackNavigator } from 'react-navigation-stack'
import {createAppContainer} from 'react-navigation'


import AdvertisementsScreen from '../screens/Advertiser/AdvertisementsScreen'
import SelectCityScreen from '../screens/Advertiser/SelectCityScreen'
import SelectCategoryScreen from '../screens/Advertiser/SelectCategoryScreen'
import AdvertisementInfoScreen from '../screens/Advertiser/AdvertisementInfoScreen'
import UpdateAdvertisementScreen from '../screens/Advertiser/UpdateAdvertisementScreen'
import DigitalBoardsScreen from '../screens/Advertiser/DigitalBoardsScreen'
import SelectDigitalBoardScreen from '../screens/Advertiser/SelectDigitalBoardScreen'
import ShowDigitalBoardOnMapScreen from '../screens/Advertiser/ShowDigitalBoardOnMapScreen'

const AdvertiserAdsNavigator = createStackNavigator({
    Advertisements:AdvertisementsScreen,
    SelectCity:SelectCityScreen,
    SelectCategory:SelectCategoryScreen,
    AdvertisementInfo:AdvertisementInfoScreen,
    UpdateAdvertisement:UpdateAdvertisementScreen,
    DigitalBoards:DigitalBoardsScreen,
    SelectDigitalBoard:SelectDigitalBoardScreen,
    ShowDigitalBoardOnMap:ShowDigitalBoardOnMapScreen
});



export default createAppContainer(AdvertiserAdsNavigator)
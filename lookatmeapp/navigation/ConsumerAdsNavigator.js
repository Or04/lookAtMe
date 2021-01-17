import { createStackNavigator } from 'react-navigation-stack'
import {createAppContainer} from 'react-navigation'





import ShowConsumerAdsScreen from '../screens/Consumer/ShowConsumerAdsScreen'
import RankAdvertiserScreen from '../screens/Consumer/RankAdvertiserScreen'



const ConsumerAdsNavigator = createStackNavigator({
    ShowConsumerAds:ShowConsumerAdsScreen,
    RankAdvertiser:RankAdvertiserScreen

});



export default createAppContainer(ConsumerAdsNavigator)
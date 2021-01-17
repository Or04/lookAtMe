import { createStackNavigator } from 'react-navigation-stack'
import {createAppContainer} from 'react-navigation'



import AddDigitalBoardScreen from '../screens/Administrator/AddDigitalBoardScreen'
import SelectCityScreen from '../screens/SelectCityScreen'



const DigitalBoardsNavigator = createStackNavigator({
    SelectCity:SelectCityScreen,
    AddDigitalBoard:AddDigitalBoardScreen,

});



export default createAppContainer(DigitalBoardsNavigator)
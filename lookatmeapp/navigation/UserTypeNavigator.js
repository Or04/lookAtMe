import { createStackNavigator } from 'react-navigation-stack'
import { createAppContainer } from 'react-navigation'



import UserTypeScreen from '../screens/UserTypeScreen'
import RankCategoriesScreen from '../screens/RankCategoriesScreen'
import ShowDigitalBoardScreen from '../screens/Global/ShowDigitalBoardScreen'
import SelectCityScreen from '../screens/Global/SelectCityScreen'
import SelectDigitalBoardScreen from '../screens/Global/SelectDigitalBoardScreen'


const UserTypeNavigator = createStackNavigator({
    UserType: UserTypeScreen,
    RankCategories: RankCategoriesScreen,
    ShowDigitalBoard: ShowDigitalBoardScreen,
    SelectCity: SelectCityScreen,
    SelectDigitalBoard: SelectDigitalBoardScreen
});



export default createAppContainer(UserTypeNavigator)
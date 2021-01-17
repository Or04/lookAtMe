import { createStackNavigator } from 'react-navigation-stack'
import {createAppContainer} from 'react-navigation'

// import LogInScreen from '../screens/LogInScreen'
import LogInScreen from '../screens/LogInScreen'
import RegistrationScreen from '../screens/RegistrationScreen'
import UserTypeScreen from '../screens/UserTypeScreen'
import RegistrationSelectCityScreen from '../screens/RegistrationSelectCityScreen'
import RegistrationSelectDigitalBoardScreen from '../screens/RegistrationSelectDigitalBoardScreen'

const LogInNavigator = createStackNavigator({
    LogIn:LogInScreen,
    Registration:RegistrationScreen,
    UserType:UserTypeScreen,
    RegistrationSelectCity:RegistrationSelectCityScreen,
    RegistrationSelectDigitalBoard:RegistrationSelectDigitalBoardScreen
});



export default createAppContainer(LogInNavigator)
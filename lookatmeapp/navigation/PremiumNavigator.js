import { createStackNavigator } from 'react-navigation-stack'
import {createAppContainer} from 'react-navigation'

// import LogInScreen from '../screens/LogInScreen'
import PremiumUserScreen from '../screens/Administrator/PremiumUserScreen'


const PremiumNavigator = createStackNavigator({
    PremiumUser:PremiumUserScreen
});



export default createAppContainer(PremiumNavigator)
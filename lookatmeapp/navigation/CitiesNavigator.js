import { createStackNavigator } from 'react-navigation-stack'
import {createAppContainer} from 'react-navigation'




import CitiesScreen from '../screens/Administrator/CitiesScreen'


const CitiesNavigator = createStackNavigator({
    Cities:CitiesScreen
});



export default createAppContainer(CitiesNavigator)